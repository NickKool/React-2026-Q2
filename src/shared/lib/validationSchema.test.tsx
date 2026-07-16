import { createFormSchema } from './validationSchema';

describe('Zod Validation Schema (createFormSchema)', () => {
  const allowedCountries = ['Belarus', 'Germany', 'Poland'];
  const schema = createFormSchema(allowedCountries);
  const mockFile = new File([''], 'avatar.png', { type: 'image/png' });

  const getValidData = () => ({
    name: 'John',
    age: 30,
    email: 'john@example.com',
    gender: 'male',
    acceptTerms: true,
    country: 'Germany',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    image: mockFile,
  });

  it('should successfully validate fully compliant data', () => {
    const result = schema.safeParse(getValidData());
    expect(result.success).toBe(true);
  });

  it('should reject empty or lowercase name values', () => {
    const data1 = { ...getValidData(), name: '' };
    const result1 = schema.safeParse(data1);
    expect(result1.success).toBe(false);

    const data2 = { ...getValidData(), name: 'john' };
    const result2 = schema.safeParse(data2);
    expect(result2.success).toBe(false);
  });

  it('should reject negative age values', () => {
    const data = { ...getValidData(), age: -5 };
    const result = schema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject invalid gender enum parameters', () => {
    const data = { ...getValidData(), gender: 'other' };
    const result = schema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should enforce checking terms and conditions flag', () => {
    const data = { ...getValidData(), acceptTerms: false };
    const result = schema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject countries missing from the allowed list state', () => {
    const data = { ...getValidData(), country: 'France' };
    const result = schema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject passwords shorter than 6 characters', () => {
    const data = { ...getValidData(), password: '12345', confirmPassword: '12345' };
    const result = schema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should catch password and confirmation mismatch errors', () => {
    const data = { ...getValidData(), password: 'Password123!', confirmPassword: 'DifferentPass!' };
    const result = schema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject files exceeding strict maximum size boundary limits', () => {
    const oversizedFile = new File([''], 'big.png', { type: 'image/png' });
    Object.defineProperty(oversizedFile, 'size', { value: 3 * 1024 * 1024 });

    const data = { ...getValidData(), image: oversizedFile };
    const result = schema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it('should reject unauthorized file extensions and mime types', () => {
    const invalidFile = new File([''], 'doc.pdf', { type: 'application/pdf' });
    const data = { ...getValidData(), image: invalidFile };
    const result = schema.safeParse(data);
    expect(result.success).toBe(false);
  });
});
