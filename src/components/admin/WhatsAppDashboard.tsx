import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Phone, Send, User, Calendar, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Conversation {
  id: string;
  phone_number: string;
  conversation_status: string;
  lead_qualification: string | null;
  last_message_at: string;
  source: string;
  metadata: any;
  messages?: Message[];
  lead?: Lead;
}

interface Message {
  id: string;
  content: string | null;
  direction: string;
  message_type: string | null;
  status: string | null;
  created_at: string | null;
}

interface Lead {
  id: string;
  name: string | null;
  email: string | null;
  company_name: string | null;
  status: string;
  service_interest: string | null;
  qualification: string | null;
}

const WhatsAppDashboard = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const { data: conversationsData, error } = await supabase
        .from('whatsapp_conversations')
        .select(`
          *,
          leads (
            id,
            name,
            email,
            company_name,
            status,
            service_interest,
            qualification
          )
        `)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      // Load messages for each conversation
      const conversationsWithMessages = await Promise.all(
        (conversationsData || []).map(async (conv) => {
          const { data: messages } = await supabase
            .from('whatsapp_messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: true });

          return {
            ...conv,
            messages: messages || [],
            lead: conv.leads?.[0] || null
          };
        })
      );

      setConversations(conversationsWithMessages);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar conversas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!selectedConversation || !newMessage.trim()) return;

    setSending(true);
    try {
      const conversation = conversations.find(c => c.id === selectedConversation);
      if (!conversation) return;

      const { data, error } = await supabase.functions.invoke('send-whatsapp-message', {
        body: {
          to: conversation.phone_number,
          message: newMessage.trim(),
          conversationId: selectedConversation
        }
      });

      if (error) throw error;

      setNewMessage('');
      await loadConversations();
      
      toast({
        title: "Sucesso",
        description: "Mensagem enviada com sucesso",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erro",
        description: "Falha ao enviar mensagem",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const getQualificationColor = (qualification: string | null) => {
    switch (qualification) {
      case 'hot': return 'bg-red-500';
      case 'warm': return 'bg-yellow-500';
      case 'cold': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'archived': return 'bg-gray-500';
      case 'blocked': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard WhatsApp</h1>
        <p className="text-muted-foreground">
          Monitore e gerencie conversas do WhatsApp Business
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Conversas</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversas Ativas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversations.filter(c => c.conversation_status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leads Quentes</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversations.filter(c => c.lead_qualification === 'hot').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensagens Hoje</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {conversations.reduce((total, conv) => 
                total + (conv.messages?.filter(m => 
                  new Date(m.created_at).toDateString() === new Date().toDateString()
                ).length || 0), 0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="conversations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="conversations">Conversas</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conversations List */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conversas</CardTitle>
                  <CardDescription>
                    {conversations.length} conversas encontradas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedConversation === conversation.id 
                          ? 'bg-primary/10 border-primary' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span className="font-medium">{conversation.phone_number}</span>
                          </div>
                          {conversation.lead?.name && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {conversation.lead.name}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={`${getStatusColor(conversation.conversation_status)} text-white`}>
                              {conversation.conversation_status}
                            </Badge>
                            {conversation.lead_qualification && (
                              <Badge className={`${getQualificationColor(conversation.lead_qualification)} text-white`}>
                                {conversation.lead_qualification}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(conversation.last_message_at), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-2">
              {selectedConv ? (
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      {selectedConv.phone_number}
                      {selectedConv.lead?.name && (
                        <span className="text-muted-foreground">- {selectedConv.lead.name}</span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Status: {selectedConv.conversation_status} • 
                      Qualificação: {selectedConv.lead_qualification || 'Não qualificado'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {selectedConv.messages?.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              message.direction === 'outbound'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p>{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {formatDistanceToNow(new Date(message.created_at), { 
                                addSuffix: true, 
                                locale: ptBR 
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Send Message */}
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Digite sua mensagem..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1"
                        rows={2}
                      />
                      <Button
                        onClick={sendMessage}
                        disabled={sending || !newMessage.trim()}
                        className="self-end"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-[600px] flex items-center justify-center">
                  <CardContent>
                    <p className="text-muted-foreground">
                      Selecione uma conversa para visualizar as mensagens
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Leads do WhatsApp</CardTitle>
              <CardDescription>
                Leads gerados através das conversas do WhatsApp
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversations.filter(c => c.lead).map((conversation) => (
                  <div key={conversation.lead!.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{conversation.lead!.name || 'Sem nome'}</h4>
                        <p className="text-sm text-muted-foreground">{conversation.phone_number}</p>
                        {conversation.lead!.company_name && (
                          <p className="text-sm">{conversation.lead!.company_name}</p>
                        )}
                        {conversation.lead!.service_interest && (
                          <p className="text-sm">Interesse: {conversation.lead!.service_interest}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Badge className={`${getQualificationColor(conversation.lead!.qualification)} text-white`}>
                          {conversation.lead!.qualification || 'Não qualificado'}
                        </Badge>
                        <Badge variant="outline">
                          {conversation.lead!.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Qualificação de Leads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Quentes</span>
                    <span className="font-medium">
                      {conversations.filter(c => c.lead_qualification === 'hot').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mornos</span>
                    <span className="font-medium">
                      {conversations.filter(c => c.lead_qualification === 'warm').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frios</span>
                    <span className="font-medium">
                      {conversations.filter(c => c.lead_qualification === 'cold').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fontes de Conversa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>WhatsApp Business</span>
                    <span className="font-medium">
                      {conversations.filter(c => c.source === 'whatsapp_business').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Website</span>
                    <span className="font-medium">
                      {conversations.filter(c => c.source === 'website').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Outbound</span>
                    <span className="font-medium">
                      {conversations.filter(c => c.source === 'outbound').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WhatsAppDashboard;