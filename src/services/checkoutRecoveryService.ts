
/**
 * Simple service to track and recover checkout state without Asaas API calls
 */
export const checkoutRecoveryService = {
  getRecoveryState(): any {
    const stateJson = localStorage.getItem('checkoutRecoveryState');
    if (!stateJson) return null;
    
    try {
      return JSON.parse(stateJson);
    } catch (e) {
      console.error('Failed to parse recovery state:', e);
      return null;
    }
  },
  
  saveRecoveryState(state: any): void {
    localStorage.setItem('checkoutRecoveryState', JSON.stringify(state));
  },
  
  clearRecoveryState(): void {
    localStorage.removeItem('checkoutRecoveryState');
  },
  
  isStateValid(state: any, currentPlanId: string): boolean {
    if (!state) return false;
    
    // Verify state contains required fields
    if (!state.planId || !state.timestamp) return false;
    
    // Verify plan ID matches
    if (state.planId !== currentPlanId) return false;
    
    // Verify state is not too old (1 hour expiration)
    const ageInMs = Date.now() - state.timestamp;
    const maxAgeInMs = 60 * 60 * 1000; // 1 hour
    
    return ageInMs < maxAgeInMs;
  }
};
