import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SendMessageRequest {
  to: string
  message: string
  type?: string
  conversationId?: string
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

    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    const { to, message, type = 'text', conversationId }: SendMessageRequest = await req.json()
    
    if (!to || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields: to, message' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const accessToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
    const phoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')
    
    if (!accessToken || !phoneNumberId) {
      return new Response(JSON.stringify({ error: 'WhatsApp credentials not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    // Format phone number (remove +55 if present and ensure it starts with 55)
    let formattedPhone = to.replace(/\D/g, '') // Remove non-digits
    if (formattedPhone.startsWith('55')) {
      // Already has country code
    } else if (formattedPhone.length === 11) {
      // Brazilian mobile number without country code
      formattedPhone = '55' + formattedPhone
    } else if (formattedPhone.length === 10) {
      // Brazilian landline without country code
      formattedPhone = '55' + formattedPhone
    }

    console.log(`Sending WhatsApp message to: ${formattedPhone}`)

    // Send message via WhatsApp Business API
    const whatsappResponse = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: type,
        text: {
          body: message
        }
      }),
    })

    const whatsappResult = await whatsappResponse.json()

    if (!whatsappResponse.ok) {
      console.error('WhatsApp API error:', whatsappResult)
      return new Response(JSON.stringify({ 
        error: 'Failed to send WhatsApp message',
        details: whatsappResult 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    console.log('WhatsApp message sent successfully:', whatsappResult)

    // Find or create conversation
    let conversation = null
    if (conversationId) {
      const { data } = await supabaseClient
        .from('whatsapp_conversations')
        .select('*')
        .eq('id', conversationId)
        .single()
      conversation = data
    }

    if (!conversation) {
      const { data: existingConversation } = await supabaseClient
        .from('whatsapp_conversations')
        .select('*')
        .eq('phone_number', formattedPhone)
        .single()

      if (existingConversation) {
        conversation = existingConversation
      } else {
        const { data: newConversation, error: createError } = await supabaseClient
          .from('whatsapp_conversations')
          .insert({
            phone_number: formattedPhone,
            source: 'outbound',
            conversation_status: 'active',
            last_message_at: new Date().toISOString()
          })
          .select()
          .single()

        if (createError) {
          console.error('Error creating conversation:', createError)
        } else {
          conversation = newConversation
        }
      }
    }

    // Save message to database
    if (conversation) {
      const { error: messageError } = await supabaseClient
        .from('whatsapp_messages')
        .insert({
          conversation_id: conversation.id,
          phone_number: formattedPhone,
          message_id: whatsappResult.messages?.[0]?.id,
          direction: 'outbound',
          content: message,
          message_type: type,
          status: 'sent',
          metadata: {
            whatsapp_response: whatsappResult
          }
        })

      if (messageError) {
        console.error('Error saving outbound message:', messageError)
      }

      // Update conversation last message time
      await supabaseClient
        .from('whatsapp_conversations')
        .update({ 
          last_message_at: new Date().toISOString(),
          conversation_status: 'active'
        })
        .eq('id', conversation.id)
    }

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: whatsappResult.messages?.[0]?.id,
      conversationId: conversation?.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Send WhatsApp message error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})