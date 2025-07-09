import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WhatsAppMessage {
  id: string
  from: string
  type: string
  text?: {
    body: string
  }
  timestamp: string
}

interface WhatsAppWebhookData {
  object: string
  entry: Array<{
    id: string
    changes: Array<{
      value: {
        messaging_product: string
        metadata: {
          display_phone_number: string
          phone_number_id: string
        }
        messages?: WhatsAppMessage[]
        statuses?: Array<{
          id: string
          status: string
          timestamp: string
          recipient_id: string
        }>
      }
      field: string
    }>
  }>
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method === 'GET') {
      // Webhook verification
      const url = new URL(req.url)
      const mode = url.searchParams.get('hub.mode')
      const token = url.searchParams.get('hub.verify_token')
      const challenge = url.searchParams.get('hub.challenge')
      
      const verifyToken = Deno.env.get('WHATSAPP_VERIFY_TOKEN')
      
      if (mode === 'subscribe' && token === verifyToken) {
        console.log('WhatsApp webhook verified successfully')
        return new Response(challenge, { status: 200 })
      } else {
        console.log('WhatsApp webhook verification failed')
        return new Response('Forbidden', { status: 403 })
      }
    }

    if (req.method === 'POST') {
      const webhookData: WhatsAppWebhookData = await req.json()
      
      console.log('Received WhatsApp webhook:', JSON.stringify(webhookData, null, 2))

      // Process incoming messages
      for (const entry of webhookData.entry) {
        for (const change of entry.changes) {
          if (change.value.messages) {
            for (const message of change.value.messages) {
              await processIncomingMessage(supabaseClient, message, change.value.metadata)
            }
          }
          
          if (change.value.statuses) {
            for (const status of change.value.statuses) {
              await processMessageStatus(supabaseClient, status)
            }
          }
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    return new Response('Method not allowed', { status: 405 })
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

async function processIncomingMessage(supabaseClient: any, message: WhatsAppMessage, metadata: any) {
  const phoneNumber = message.from
  const content = message.text?.body || ''
  
  console.log(`Processing message from ${phoneNumber}: ${content}`)

  // Find or create conversation
  let { data: conversation, error: conversationError } = await supabaseClient
    .from('whatsapp_conversations')
    .select('*')
    .eq('phone_number', phoneNumber)
    .single()

  if (conversationError && conversationError.code === 'PGRST116') {
    // Create new conversation
    const { data: newConversation, error: createError } = await supabaseClient
      .from('whatsapp_conversations')
      .insert({
        phone_number: phoneNumber,
        source: 'whatsapp_business',
        conversation_status: 'active',
        last_message_at: new Date().toISOString(),
        metadata: {
          display_phone_number: metadata.display_phone_number,
          phone_number_id: metadata.phone_number_id
        }
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating conversation:', createError)
      return
    }
    
    conversation = newConversation
  } else if (conversationError) {
    console.error('Error finding conversation:', conversationError)
    return
  }

  // Save message
  const { error: messageError } = await supabaseClient
    .from('whatsapp_messages')
    .insert({
      conversation_id: conversation.id,
      phone_number: phoneNumber,
      message_id: message.id,
      direction: 'inbound',
      content: content,
      message_type: message.type,
      status: 'received',
      metadata: {
        timestamp: message.timestamp,
        whatsapp_message_id: message.id
      }
    })

  if (messageError) {
    console.error('Error saving message:', messageError)
    return
  }

  // Update conversation last message time
  await supabaseClient
    .from('whatsapp_conversations')
    .update({ 
      last_message_at: new Date().toISOString(),
      conversation_status: 'active'
    })
    .eq('id', conversation.id)

  // Create or update lead
  await processLead(supabaseClient, phoneNumber, content, conversation.id)
  
  // Auto-qualify lead based on message content
  await autoQualifyLead(supabaseClient, conversation.id, content)
}

async function processMessageStatus(supabaseClient: any, status: any) {
  console.log(`Processing message status: ${status.status} for message ${status.id}`)
  
  // Update message status
  await supabaseClient
    .from('whatsapp_messages')
    .update({ status: status.status })
    .eq('message_id', status.id)
}

async function processLead(supabaseClient: any, phoneNumber: string, messageContent: string, conversationId: string) {
  // Check if lead already exists
  let { data: lead, error: leadError } = await supabaseClient
    .from('leads')
    .select('*')
    .eq('phone', phoneNumber)
    .single()

  if (leadError && leadError.code === 'PGRST116') {
    // Create new lead
    const { data: newLead, error: createError } = await supabaseClient
      .from('leads')
      .insert({
        phone: phoneNumber,
        lead_source: 'whatsapp_business',
        status: 'new',
        whatsapp_conversation_id: conversationId,
        metadata: {
          first_message: messageContent,
          first_contact_at: new Date().toISOString()
        }
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating lead:', createError)
    } else {
      console.log('New lead created:', newLead.id)
    }
  } else if (!leadError) {
    // Update existing lead
    await supabaseClient
      .from('leads')
      .update({ 
        status: 'engaged',
        whatsapp_conversation_id: conversationId,
        updated_at: new Date().toISOString()
      })
      .eq('id', lead.id)
  }
}

async function autoQualifyLead(supabaseClient: any, conversationId: string, messageContent: string) {
  const content = messageContent.toLowerCase()
  
  // Simple qualification logic based on keywords
  let qualification = 'cold'
  let serviceInterest = null
  
  // High-intent keywords
  if (content.includes('quero') || content.includes('preciso') || content.includes('interessado') || 
      content.includes('contratar') || content.includes('orçamento') || content.includes('preço')) {
    qualification = 'hot'
  }
  
  // Medium-intent keywords
  if (content.includes('informação') || content.includes('saber mais') || content.includes('como funciona')) {
    qualification = 'warm'
  }

  // Service interest detection
  if (content.includes('mar') || content.includes('consultoria') || content.includes('estratégia')) {
    serviceInterest = 'mar'
  } else if (content.includes('mentoria') || content.includes('coaching')) {
    serviceInterest = 'mentorias'
  } else if (content.includes('logo') || content.includes('identidade') || content.includes('visual')) {
    serviceInterest = 'identidade_visual'
  } else if (content.includes('site') || content.includes('projeto')) {
    serviceInterest = 'projetos'
  } else if (content.includes('oficina') || content.includes('gestão') || content.includes('escola')) {
    serviceInterest = 'oficina_lideres'
  }

  // Update conversation with qualification
  await supabaseClient
    .from('whatsapp_conversations')
    .update({ 
      lead_qualification: qualification,
      metadata: {
        service_interest: serviceInterest,
        auto_qualified_at: new Date().toISOString(),
        qualification_keywords: content.split(' ').filter(word => 
          ['quero', 'preciso', 'interessado', 'contratar', 'orçamento', 'preço', 'mar', 'consultoria'].includes(word)
        )
      }
    })
    .eq('id', conversationId)

  console.log(`Lead auto-qualified as: ${qualification}, service interest: ${serviceInterest}`)
}