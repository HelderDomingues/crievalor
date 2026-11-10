
import { PaymentType } from "@/components/pricing/PaymentOptions";
import { checkoutRecoveryService } from "@/services/checkoutRecoveryService";

/**
 * Utilitário para testar os diferentes fluxos do checkout
 */
export const checkoutTestUtils = {
  /**
   * Simula o estado de checkout para diferentes cenários
   */
  simulateCheckoutState(scenario: 'new-user' | 'existing-user' | 'recovery' | 'abandoned' | 'clear', options?: {
    planId?: string;
    installments?: number;
    paymentType?: PaymentType;
    email?: string;
    fullName?: string;
    phone?: string;
    cpf?: string;
  }) {
    const defaults = {
      planId: 'standard_monthly',
      installments: 1,
      paymentType: 'credit' as PaymentType,
      email: 'teste@exemplo.com',
      fullName: 'Usuário de Teste',
      phone: '47999999999',
      cpf: '12345678909'
    };

    const config = { ...defaults, ...options };
    
    // Limpar dados existentes
    if (scenario === 'clear') {
      localStorage.removeItem('customerEmail');
      localStorage.removeItem('customerPhone');
      localStorage.removeItem('customerName');
      localStorage.removeItem('customerCPF');
      localStorage.removeItem('checkoutInstallments');
      localStorage.removeItem('checkoutPaymentType');
      localStorage.removeItem('checkoutPlanId');
      localStorage.removeItem('checkoutTimestamp');
      localStorage.removeItem('lastPaymentUrl');
      localStorage.removeItem('checkoutAttempts');
      localStorage.removeItem('checkoutSubscriptionId');
      localStorage.removeItem('checkoutPaymentId');
      checkoutRecoveryService.clearRecoveryState();
      
      console.log('✅ Estado de checkout limpo');
      return;
    }
    
    // Dados compartilhados por todos os cenários
    localStorage.setItem('customerEmail', config.email);
    localStorage.setItem('customerPhone', config.phone);
    localStorage.setItem('customerName', config.fullName);
    localStorage.setItem('customerCPF', config.cpf);
    localStorage.setItem('checkoutInstallments', String(config.installments));
    localStorage.setItem('checkoutPaymentType', config.paymentType);
    localStorage.setItem('checkoutPlanId', config.planId);
    
    if (scenario === 'new-user') {
      // Simulação de novo usuário (apenas dados básicos)
      localStorage.setItem('checkoutTimestamp', String(Date.now()));
      console.log('✅ Simulação de novo usuário configurada');
    } 
    else if (scenario === 'existing-user') {
      // Simulação de usuário existente
      localStorage.setItem('checkoutTimestamp', String(Date.now()));
      console.log('✅ Simulação de usuário existente configurada');
    }
    else if (scenario === 'recovery') {
      // Simulação de recuperação de checkout
      const mockPaymentLink = 'https://checkout.example.test/c/123456789';
      localStorage.setItem('lastPaymentUrl', mockPaymentLink);
      localStorage.setItem('checkoutTimestamp', String(Date.now() - 5 * 60 * 1000)); // 5 minutos atrás
      
      const recoveryState = {
        timestamp: Date.now() - 5 * 60 * 1000,
        planId: config.planId,
        installments: config.installments,
        paymentType: config.paymentType,
        processId: `test_${Date.now()}`,
        paymentLink: mockPaymentLink,
        formData: {
          email: config.email,
          phone: config.phone,
          fullName: config.fullName,
          cpf: config.cpf,
          password: ''
        }
      };
      
      checkoutRecoveryService.saveRecoveryState(recoveryState);
      console.log('✅ Simulação de recuperação de checkout configurada');
    }
    else if (scenario === 'abandoned') {
      // Simulação de checkout abandonado
      localStorage.setItem('checkoutTimestamp', String(Date.now() - 2 * 60 * 60 * 1000)); // 2 horas atrás
      console.log('✅ Simulação de checkout abandonado configurada');
    }
  },
  
  /**
   * Verifica a consistência dos dados entre etapas
   */
  verifyDataConsistency() {
    const email = localStorage.getItem('customerEmail');
    const phone = localStorage.getItem('customerPhone');
    const name = localStorage.getItem('customerName');
    const cpf = localStorage.getItem('customerCPF');
    const installments = localStorage.getItem('checkoutInstallments');
    const paymentType = localStorage.getItem('checkoutPaymentType');
    const planId = localStorage.getItem('checkoutPlanId');
    const timestamp = localStorage.getItem('checkoutTimestamp');
    const paymentUrl = localStorage.getItem('lastPaymentUrl');
    const recoveryState = checkoutRecoveryService.getRecoveryState();
    
    console.group('📊 Verificação de consistência de dados');
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Name:', name);
    console.log('CPF:', cpf);
    console.log('Installments:', installments);
    console.log('Payment Type:', paymentType);
    console.log('Plan ID:', planId);
    console.log('Timestamp:', timestamp ? new Date(Number(timestamp)).toLocaleString() : null);
    console.log('Payment URL:', paymentUrl);
    console.log('Recovery State:', recoveryState);
    console.groupEnd();
    
    // Verificar se todos os dados necessários estão presentes
    const isDataComplete = email && phone && name && cpf && installments && paymentType && planId;
    return {
      isDataComplete,
      hasRecoveryState: !!recoveryState,
      hasPaymentUrl: !!paymentUrl,
      data: {
        email, phone, name, cpf, installments, paymentType, planId, timestamp, paymentUrl, recoveryState
      }
    };
  },
  
  /**
   * Simula erros comuns durante o checkout
   */
  simulateError(errorType: 'payment-failed' | 'validation-error' | 'network-error' | 'server-error') {
    if (errorType === 'payment-failed') {
      console.error('🔴 Simulação de erro: Falha no processamento do pagamento');
      return new Error('O pagamento não pôde ser processado. Por favor, tente novamente ou use outro método de pagamento.');
    }
    else if (errorType === 'validation-error') {
      console.error('🔴 Simulação de erro: Dados de formulário inválidos');
      return new Error('Por favor, verifique os dados informados e tente novamente.');
    }
    else if (errorType === 'network-error') {
      console.error('🔴 Simulação de erro: Falha na conexão de rede');
      return new Error('Não foi possível conectar ao servidor de pagamento. Verifique sua conexão e tente novamente.');
    }
    else {
      console.error('🔴 Simulação de erro: Erro interno do servidor');
      return new Error('Ocorreu um erro interno. Nossa equipe foi notificada e estamos trabalhando para resolver o problema.');
    }
  }
};
