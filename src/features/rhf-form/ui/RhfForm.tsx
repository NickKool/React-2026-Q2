import React from 'react';
import { useForm, Controller,useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFormSchema, type FormInputValues } from '../../../shared/lib/validation';
import { useSubmissionStore } from '@/entities/submission/model/store';
import { convertToBase64 } from '@/shared/lib/file';
import { PasswordInput } from '@/shared/ui/password-input/PasswordInput';
import { Combobox } from '@/shared/ui/combobox/Combobox';

interface RhfFormProps {
  onSuccess: () => void;
}

export const RhfForm: React.FC<RhfFormProps> = ({ onSuccess }) => {
  const { countries, addSubmission } = useSubmissionStore();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm<FormInputValues>({
    resolver: zodResolver(createFormSchema(countries)),
    mode: 'onChange', 
    defaultValues: {
      name: '',
      age: undefined,
      email: '',
      gender: undefined,
      country: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

const passwordValue = useWatch({
  control,
  name: 'password',
  defaultValue: '',
});

const onSubmit = async (data: FormInputValues) => {
  try {
    const fileList = data.image as unknown as FileList;
    const file = fileList[0]; 
    
    if (!file) return;

    const base64Image = await convertToBase64(file);

    addSubmission({
      name: data.name,
      age: Number(data.age), 
      email: data.email,
      gender: data.gender as 'male' | 'female',
      country: data.country,
      imageBas64: base64Image,
    });

    reset();
    onSuccess();
  } catch (error) {
    console.error('Error submitting RHF form:', error);
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="rhf-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          id="rhf-name"
          type="text"
          {...register('name')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="rhf-age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
        <input
          id="rhf-age"
          type="number"
          {...register('age', { valueAsNumber: true })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age.message}</p>}
      </div>

      <div>
        <label htmlFor="rhf-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          id="rhf-email"
          type="email"
          {...register('email')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="rhf-gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
        <select
          id="rhf-gender"
          {...register('gender')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>}
      </div>

      <Controller
        name="country"
        control={control}
        render={({ field }) => (
          <Combobox
            id="rhf-country"
            label="Country"
            options={countries}
            value={field.value}
            onChange={field.onChange}
            error={errors.country?.message}
          />
        )}
      />

      <PasswordInput
        id="rhf-password"
        label="Password"
        {...register('password')}
        value={passwordValue}
        error={errors.password?.message}
        showStrength={true}
      />

      <PasswordInput
        id="rhf-confirmPassword"
        label="Confirm Password"
        {...register('confirmPassword')}
        error={errors.confirmPassword?.message}
      />

      <div>
        <label htmlFor="rhf-image" className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
        <input
          id="rhf-image"
          type="file"
          accept="image/jpeg,image/png"
          {...register('image')}
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image.message as string}</p>}
      </div>

      <div className="flex items-start py-2">
        <input
          id="rhf-acceptTerms"
          type="checkbox"
          {...register('acceptTerms')}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
        />
        <label htmlFor="rhf-acceptTerms" className="ml-2 block text-sm text-gray-900">
          I accept the Terms and Conditions
        </label>
      </div>
      {errors.acceptTerms && <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>}

      <button
        type="submit"
        disabled={!isValid} 
        className={`w-full rounded-md py-2.5 text-sm font-semibold text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors ${
          !isValid ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
        }`}
      >
        Submit (React Hook Form)
      </button>
    </form>
  );
};
