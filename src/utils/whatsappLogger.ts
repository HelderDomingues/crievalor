/**
 * Sistema de logging especializado para WhatsApp Business
 * Integração com errorUtils para logging unificado
 */

import { errorUtils, ErrorLogData } from './errorUtils';

export interface WhatsAppEvent {
  type: 'message_sent' | 'message_received' | 'conversation_started' | 'lead_qualified' | 'error';
  phoneNumber: string;
  messageId?: string;
  message?: string;
  leadData?: {
    name?: string;
    email?: string;
    service?: string;
    qualification?: 'hot' | 'warm' | 'cold';
  };
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface WhatsAppLogData extends ErrorLogData {
  whatsappEvent?: WhatsAppEvent;
  phoneNumber?: string;
  conversationId?: string;
}

class WhatsAppLogger {
  private events: WhatsAppEvent[] = [];
  private readonly MAX_EVENTS = 100;

  /**
   * Log de evento do WhatsApp
   */
  logWhatsAppEvent(event: Omit<WhatsAppEvent, 'timestamp'>): WhatsAppEvent {
    const fullEvent: WhatsAppEvent = {
      ...event,
      timestamp: Date.now()
    };

    // Adicionar ao histórico
    this.events.unshift(fullEvent);
    if (this.events.length > this.MAX_EVENTS) {
      this.events.pop();
    }

    // Log no console com formatação específica
    console.log(
      `[WHATSAPP ${fullEvent.type.toUpperCase()}]`,
      `${fullEvent.phoneNumber}:`,
      fullEvent.message || 'No message',
      fullEvent.metadata || {}
    );

    // Se for erro, usar também o errorUtils
    if (event.type === 'error') {
      errorUtils.logError(
        new Error(fullEvent.message || 'WhatsApp error'),
        {
          phoneNumber: fullEvent.phoneNumber,
          whatsappEvent: fullEvent,
          ...fullEvent.metadata
        },
        `whatsapp_${Date.now()}`
      );
    }

    // Salvar no localStorage para debug
    try {
      localStorage.setItem('whatsapp_last_events', JSON.stringify(this.events.slice(0, 10)));
    } catch (e) {
      console.warn('Não foi possível salvar eventos do WhatsApp no localStorage');
    }

    return fullEvent;
  }

  /**
   * Log de mensagem enviada
   */
  logMessageSent(phoneNumber: string, message: string, messageId?: string, metadata?: Record<string, any>) {
    return this.logWhatsAppEvent({
      type: 'message_sent',
      phoneNumber,
      message,
      messageId,
      metadata
    });
  }

  /**
   * Log de mensagem recebida
   */
  logMessageReceived(phoneNumber: string, message: string, messageId?: string, metadata?: Record<string, any>) {
    return this.logWhatsAppEvent({
      type: 'message_received',
      phoneNumber,
      message,
      messageId,
      metadata
    });
  }

  /**
   * Log de nova conversa iniciada
   */
  logConversationStarted(phoneNumber: string, source?: string, metadata?: Record<string, any>) {
    return this.logWhatsAppEvent({
      type: 'conversation_started',
      phoneNumber,
      message: `Conversa iniciada via ${source || 'site'}`,
      metadata: { source, ...metadata }
    });
  }

  /**
   * Log de lead qualificado
   */
  logLeadQualified(phoneNumber: string, leadData: WhatsAppEvent['leadData'], metadata?: Record<string, any>) {
    return this.logWhatsAppEvent({
      type: 'lead_qualified',
      phoneNumber,
      message: `Lead qualificado: ${leadData?.name || 'Sem nome'}`,
      leadData,
      metadata
    });
  }

  /**
   * Log de erro do WhatsApp
   */
  logWhatsAppError(phoneNumber: string, error: any, context?: Record<string, any>) {
    return this.logWhatsAppEvent({
      type: 'error',
      phoneNumber,
      message: error?.message || String(error),
      metadata: { error, ...context }
    });
  }

  /**
   * Obter histórico de eventos
   */
  getEvents(): WhatsAppEvent[] {
    return [...this.events];
  }

  /**
   * Obter eventos por número de telefone
   */
  getEventsByPhone(phoneNumber: string): WhatsAppEvent[] {
    return this.events.filter(event => event.phoneNumber === phoneNumber);
  }

  /**
   * Limpar histórico de eventos
   */
  clearEvents(): void {
    this.events.length = 0;
    localStorage.removeItem('whatsapp_last_events');
  }

  /**
   * Obter estatísticas dos eventos
   */
  getStats() {
    const stats = {
      total: this.events.length,
      messagesSent: 0,
      messagesReceived: 0,
      conversationsStarted: 0,
      leadsQualified: 0,
      errors: 0,
      uniquePhones: new Set<string>()
    };

    this.events.forEach(event => {
      stats.uniquePhones.add(event.phoneNumber);
      switch (event.type) {
        case 'message_sent':
          stats.messagesSent++;
          break;
        case 'message_received':
          stats.messagesReceived++;
          break;
        case 'conversation_started':
          stats.conversationsStarted++;
          break;
        case 'lead_qualified':
          stats.leadsQualified++;
          break;
        case 'error':
          stats.errors++;
          break;
      }
    });

    return {
      ...stats,
      uniquePhones: stats.uniquePhones.size
    };
  }
}

// Export singleton instance
export const whatsappLogger = new WhatsAppLogger();

// Export utility functions for easy access
export const logWhatsAppEvent = whatsappLogger.logWhatsAppEvent.bind(whatsappLogger);
export const logMessageSent = whatsappLogger.logMessageSent.bind(whatsappLogger);
export const logMessageReceived = whatsappLogger.logMessageReceived.bind(whatsappLogger);
export const logConversationStarted = whatsappLogger.logConversationStarted.bind(whatsappLogger);
export const logLeadQualified = whatsappLogger.logLeadQualified.bind(whatsappLogger);
export const logWhatsAppError = whatsappLogger.logWhatsAppError.bind(whatsappLogger);