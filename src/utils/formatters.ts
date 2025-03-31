
// Format functions
export const formatCurrency = (value: number): string => {
  return (value / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR');
};

// Phone number functions
export const sanitizePhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

export const formatPhoneNumber = (phone: string): string => {
  const digits = sanitizePhoneNumber(phone);
  
  if (digits.length <= 2) {
    return digits;
  } else if (digits.length <= 6) {
    return `(${digits.substring(0, 2)}) ${digits.substring(2)}`;
  } else if (digits.length <= 10) {
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 6)}-${digits.substring(6)}`;
  } else {
    return `(${digits.substring(0, 2)}) ${digits.substring(2, 7)}-${digits.substring(7, 11)}`;
  }
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const digits = sanitizePhoneNumber(phone);
  return digits.length === 10 || digits.length === 11;
};

// CPF functions
export const sanitizeCPF = (cpf: string): string => {
  return cpf.replace(/\D/g, '');
};

export const formatCPF = (cpf: string): string => {
  const digits = sanitizeCPF(cpf);
  
  if (digits.length <= 3) {
    return digits;
  } else if (digits.length <= 6) {
    return `${digits.substring(0, 3)}.${digits.substring(3)}`;
  } else if (digits.length <= 9) {
    return `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6)}`;
  } else {
    return `${digits.substring(0, 3)}.${digits.substring(3, 6)}.${digits.substring(6, 9)}-${digits.substring(9, 11)}`;
  }
};

export const isValidCPF = (cpf: string): boolean => {
  const digits = sanitizeCPF(cpf);
  
  // CPF must have 11 digits
  if (digits.length !== 11) return false;
  
  // All digits cannot be the same
  if (/^(\d)\1{10}$/.test(digits)) return false;
  
  // Validate first verification digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits.charAt(i)) * (10 - i);
  }
  let remainder = sum % 11;
  let verificationDigit1 = remainder < 2 ? 0 : 11 - remainder;
  
  if (parseInt(digits.charAt(9)) !== verificationDigit1) return false;
  
  // Validate second verification digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits.charAt(i)) * (11 - i);
  }
  remainder = sum % 11;
  let verificationDigit2 = remainder < 2 ? 0 : 11 - remainder;
  
  return parseInt(digits.charAt(10)) === verificationDigit2;
};
