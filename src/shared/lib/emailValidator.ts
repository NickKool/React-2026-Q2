export const validateEmailWithoutRegex = (email: string): boolean => {
  if (!email) return false;
  
  const cleanEmail = email.trim();
  const parts = cleanEmail.split('@');
  
  if (parts.length !== 2) return false;

  const [local, domain] = parts;
  if (!local || !domain) return false;
  if (!domain.includes('.')) return false;
  if (domain.startsWith('.') || domain.endsWith('.')) return false;

  return true;
};
