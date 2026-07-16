import { validateEmailWithoutRegex } from '@/shared/lib'

describe('validateEmailWithoutRegex', () => {
  it('should return true for a perfectly valid email structure', () => {
    expect(validateEmailWithoutRegex('user@example.com')).toBe(true);
    expect(validateEmailWithoutRegex('first.last@subdomain.example.org')).toBe(true);
  });

  it('should return false when the input string is empty', () => {
    expect(validateEmailWithoutRegex('')).toBe(false);
  });

  it('should return false if there is no @ symbol', () => {
    expect(validateEmailWithoutRegex('userexample.com')).toBe(false);
  });

  it('should return false if there are multiple @ symbols', () => {
    expect(validateEmailWithoutRegex('user@sub@example.com')).toBe(false);
  });

  it('should return false if the local part before @ is empty', () => {
    expect(validateEmailWithoutRegex('@example.com')).toBe(false);
  });

  it('should return false if the domain part after @ is empty', () => {
    expect(validateEmailWithoutRegex('user@')).toBe(false);
  });

  it('should return false if the domain part does not contain a dot', () => {
    expect(validateEmailWithoutRegex('user@example')).toBe(false);
  });

  it('should return false if the domain part starts or ends with a dot', () => {
    expect(validateEmailWithoutRegex('user@.example.com')).toBe(false);
    expect(validateEmailWithoutRegex('user@example.com.')).toBe(false);
  });

  it('should correctly handle and trim whitespace around the email address', () => {
    expect(validateEmailWithoutRegex('  user@example.com  ')).toBe(true);
  });
});
