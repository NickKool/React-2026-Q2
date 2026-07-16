import { calculatePasswordStrength } from './passwordStrength';

describe('calculatePasswordStrength utility', () => {
  it('should return a score of 0 and all flags as false for an empty password', () => {
    const result = calculatePasswordStrength('');

    expect(result).toEqual({
      hasDigit: false,
      hasUpper: false,
      hasLower: false,
      hasSpecial: false,
      score: 0,
    });
  });

  it('should return a score of 1 and detect only lowercase letters when input contains nothing else', () => {
    const result = calculatePasswordStrength('abcdef');

    expect(result).toEqual({
      hasDigit: false,
      hasUpper: false,
      hasLower: true,
      hasSpecial: false,
      score: 1,
    });
  });

  it('should return a score of 2 and detect lowercase and uppercase letters correctly', () => {
    const result = calculatePasswordStrength('abcDEF');

    expect(result).toEqual({
      hasDigit: false,
      hasUpper: true,
      hasLower: true,
      hasSpecial: false,
      score: 2,
    });
  });

  it('should return a score of 3 and detect lowercase, uppercase, and digits correctly', () => {
    const result = calculatePasswordStrength('abcDEF123');

    expect(result).toEqual({
      hasDigit: true,
      hasUpper: true,
      hasLower: true,
      hasSpecial: false,
      score: 3,
    });
  });

  it('should return a maximum score of 4 when all strict complexity rules pass', () => {
    const result = calculatePasswordStrength('abcDEF123!@#');

    expect(result).toEqual({
      hasDigit: true,
      hasUpper: true,
      hasLower: true,
      hasSpecial: true,
      score: 4,
    });
  });

  it('should correctly evaluate combinations containing only digits and special characters', () => {
    const result = calculatePasswordStrength('123456!!!');

    expect(result).toEqual({
      hasDigit: true,
      hasUpper: false,
      hasLower: false,
      hasSpecial: true,
      score: 2,
    });
  });
});
