import { z } from 'zod';
import { validateEmailWithoutRegex } from './emailValidator';

export const createFormSchema = (allowedCountries: string[]) => 
  z.object({
    name: z.string()
      .min(1, 'Name is required')
      .refine(val => /^[A-ZА-Я]/.test(val), 'First letter must be capitalized'),
    
    // Передаем сообщение о неверном типе через стандартный параметр message
    age: z.number({ message: 'Age must be a number' })
      .nonnegative('Negative values are not allowed'),
    
    email: z.string()
      .min(1, 'Email is required')
      .refine(validateEmailWithoutRegex, 'Invalid email format'),
    
    // Убираем errorMap, заменяя на message
    gender: z.enum(['male', 'female'], { message: 'Please select a gender' }),
    
    acceptTerms: z.literal(true, { message: 'You must accept the terms and conditions' }),
    
    country: z.string()
      .min(1, 'Please select a country')
      .refine(val => allowedCountries.includes(val), 'Country must be from the allowed list'),
    
    password: z.string().min(6, 'Password is too short (minimum 6 characters)'),
    
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    
    // Универсальная валидация для RHF (FileList) и неконтролируемой формы (File)
    image: z.unknown()
      .refine((val) => {
        if (!val) return false;
        if (val instanceof FileList) return val.length > 0;
        if (val instanceof File) return true;
        return false;
      }, 'Image is required')
      .transform((val) => {
        if (val instanceof FileList) return val[0]; // Извлекаем первый файл для проверки
        return val as File;
      })
      .refine((file) => file && file.size <= 2 * 1024 * 1024, 'Maximum size is 2MB')
      .refine(
        (file) => file && ['image/jpeg', 'image/png'].includes(file.type),
        'Only JPEG and PNG formats are allowed'
      ),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export type FormValues = z.infer<ReturnType<typeof createFormSchema>>;
