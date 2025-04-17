
/**
 * Utility for testing checkout flows
 */
export const checkoutTestUtils = {
  simulateCheckoutState(scenario: 'new-user' | 'existing-user' | 'recovery' | 'abandoned' | 'clear', options: { planId?: string } = {}) {
    const { planId = 'basic_plan' } = options;
    
    // Clear all existing state first
    if (scenario === 'clear') {
      this.clearAllCheckoutData();
      return;
    }
    
    switch (scenario) {
      case 'new-user':
        // Clean slate, no previous data
        this.clearAllCheckoutData();
        break;
        
      case 'existing-user':
        // Simulate returning user with profile data
        localStorage.setItem('customerEmail', 'test@example.com');
        localStorage.setItem('customerPhone', '(47) 99999-9999');
        localStorage.setItem('customerName', 'Usuario de Teste');
        localStorage.setItem('customerCPF', '123.456.789-00');
        break;
        
      case 'recovery':
        // Simulate interrupted checkout session
        localStorage.setItem('checkoutRecoveryState', JSON.stringify({
          timestamp: Date.now() - 5 * 60 * 1000, // 5 minutes ago
          planId: planId,
          installments: 12,
          paymentType: 'credit',
          processId: `test_${Date.now()}`,
          formData: {
            email: 'recovery@example.com',
            phone: '(47) 99999-8888',
            fullName: 'Usuario Recuperado',
            cpf: '123.456.789-11',
          },
          paymentLink: 'https://sandbox.asaas.com/c/vydr3n77kew5fd4s'
        }));
        break;
        
      case 'abandoned':
        // Simulate old abandoned checkout
        localStorage.setItem('checkoutRecoveryState', JSON.stringify({
          timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
          planId: planId,
          installments: 12,
          paymentType: 'credit',
          processId: `test_${Date.now() - 1000000}`,
          formData: {
            email: 'abandoned@example.com',
            phone: '(47) 99999-7777',
            fullName: 'Usuario Abandono',
            cpf: '123.456.789-22',
          }
        }));
        break;
    }
  },
  
  clearAllCheckoutData() {
    // Clear all localStorage items related to checkout
    const keysToRemove = [
      'checkoutRecoveryState',
      'customerEmail',
      'customerPhone',
      'customerName',
      'customerCPF',
      'checkoutPlanId',
      'checkoutInstallments',
      'checkoutTimestamp',
      'checkoutPaymentType',
      'paymentIntent',
      'lastPaymentResult',
      'lastPaymentState',
      'formDataTimestamp',
      'cachedCustomerData',
      'lastFormSubmission'
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  },
  
  verifyDataConsistency() {
    // This function checks if there are any conflicting or inconsistent data
    // in the localStorage related to checkout
    console.log('Current checkout state:');
    
    // General checkout data
    console.log('- Customer:', {
      email: localStorage.getItem('customerEmail'),
      phone: localStorage.getItem('customerPhone'),
      name: localStorage.getItem('customerName'),
      cpf: localStorage.getItem('customerCPF')
    });
    
    // Recovery state
    const recoveryState = localStorage.getItem('checkoutRecoveryState');
    console.log('- Recovery state:', recoveryState ? 'Present' : 'None');
    
    if (recoveryState) {
      try {
        const state = JSON.parse(recoveryState);
        const ageInMinutes = Math.round((Date.now() - state.timestamp) / (60 * 1000));
        console.log(`  - Age: ${ageInMinutes} minutes`);
        console.log(`  - Plan: ${state.planId}`);
        console.log(`  - Payment type: ${state.paymentType}`);
      } catch (e) {
        console.log('  - Invalid recovery state JSON');
      }
    }
    
    // Payment intent
    const paymentIntent = localStorage.getItem('paymentIntent');
    console.log('- Payment intent:', paymentIntent ? 'Present' : 'None');
    
    return true;
  }
};
