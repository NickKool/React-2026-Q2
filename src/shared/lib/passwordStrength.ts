export interface PasswordStrength {
  hasDigit: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasSpecial: boolean;
  score: number;
}

export const calculatePasswordStrength = (password: string): PasswordStrength => {
  const hasDigit = /[0-9]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const score = [hasDigit, hasUpper, hasLower, hasSpecial].filter(Boolean).length;

  return { hasDigit, hasUpper, hasLower, hasSpecial, score };
};
