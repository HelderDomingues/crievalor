import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Phone, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { logConversationStarted, logWhatsAppError } from '@/utils/whatsappLogger';

interface WhatsAppBusinessProps {
  defaultNumber?: string;
  className?: string;
}

export const WhatsAppBusiness: React.FC<WhatsAppBusinessProps> = ({
  defaultNumber = "+5547992150289",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'initial' | 'form' | 'redirect'>('initial');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar o widget após alguns segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleQuickStart = (serviceType: string) => {
    try {
      const message = encodeURIComponent(
        `Olá! Vim através do site e tenho interesse no serviço: ${serviceType}. Gostaria de saber mais informações.`
      );
      const whatsappUrl = `https://wa.me/${defaultNumber.replace(/[^0-9]/g, '')}?text=${message}`;
      
      logConversationStarted(defaultNumber, `quick_start_${serviceType}`, {
        serviceType,
        source: 'floating_widget'
      });

      window.open(whatsappUrl, '_blank');
      setIsOpen(false);
    } catch (error) {
      logWhatsAppError(defaultNumber, error, { action: 'quick_start', serviceType });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const message = encodeURIComponent(
        `Olá! Meu nome é ${formData.name}.\n\n` +
        `📧 Email: ${formData.email}\n` +
        `📱 Telefone: ${formData.phone}\n` +
        `💼 Serviço de interesse: ${formData.service}\n\n` +
        `💬 Mensagem: ${formData.message}`
      );

      const whatsappUrl = `https://wa.me/${defaultNumber.replace(/[^0-9]/g, '')}?text=${message}`;
      
      logConversationStarted(defaultNumber, 'form_submission', {
        formData,
        source: 'floating_widget'
      });

      window.open(whatsappUrl, '_blank');
      setIsOpen(false);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
      setCurrentStep('initial');
    } catch (error) {
      logWhatsAppError(defaultNumber, error, { action: 'form_submit', formData });
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="relative bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Abrir WhatsApp Business"
        >
          <MessageCircle className="h-6 w-6" />
          
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white">!</span>
          </div>
        </Button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <Card className="w-80 h-96 bg-white border shadow-2xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-green-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold text-sm">Crie Valor</h3>
                <p className="text-xs opacity-90">WhatsApp Business</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-green-600 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4 h-full flex flex-col">
            {currentStep === 'initial' && (
              <div className="space-y-4">
                <div className="text-center text-sm text-muted-foreground mb-4">
                  Olá! Como posso ajudar você hoje?
                </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-sm"
                    onClick={() => handleQuickStart('MAR - Sistema de Inteligência Organizacional')}
                  >
                    🎯 Conhecer o MAR
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start text-sm"
                    onClick={() => handleQuickStart('Oficina de Líderes')}
                  >
                    👥 Oficina de Líderes
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start text-sm"
                    onClick={() => handleQuickStart('Mentorias em Gestão e Marketing')}
                  >
                    👨‍💼 Mentorias Empresariais
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start text-sm"
                    onClick={() => handleQuickStart('Branding e Identidade Visual')}
                  >
                    🎨 Branding & Identidade
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start text-sm"
                    onClick={() => handleQuickStart('Diagnóstico Empresarial Gratuito')}
                  >
                    📊 Diagnóstico Gratuito
                  </Button>
                </div>

                <div className="pt-2 border-t">
                  <Button
                    variant="ghost"
                    className="w-full text-sm text-primary"
                    onClick={() => setCurrentStep('form')}
                  >
                    💬 Enviar mensagem personalizada
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 'form' && (
              <form onSubmit={handleFormSubmit} className="space-y-3 flex-1">
                <div className="space-y-2">
                  <Input
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="text-sm"
                  />
                  
                  <Input
                    type="email"
                    placeholder="Seu email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="text-sm"
                  />
                  
                  <Input
                    placeholder="Seu telefone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                    className="text-sm"
                  />
                  
                  <Input
                    placeholder="Serviço de interesse"
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    required
                    className="text-sm"
                  />
                  
                  <Textarea
                    placeholder="Sua mensagem..."
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={3}
                    className="text-sm resize-none"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep('initial')}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="flex-1 bg-green-500 hover:bg-green-600"
                  >
                    Enviar
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default WhatsAppBusiness;