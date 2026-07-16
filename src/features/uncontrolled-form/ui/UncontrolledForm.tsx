import React, { useState, useRef } from 'react';
import { createFormSchema, convertToBase64 } from '@/shared/lib';
import { useSubmissionStore } from '@/entities/submission/model/store';
import { PasswordInput } from '@/shared/ui/password-input/PasswordInput';
import { Combobox } from '@/shared/ui/combobox/Combobox';

interface UncontrolledFormProps {
  onSuccess: () => void;
}

export const UncontrolledForm: React.FC<UncontrolledFormProps> = ({ onSuccess }) => {
  const { countries, addSubmission } = useSubmissionStore();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const countryInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    const formData = new FormData(target);
    
    const rawAge = formData.get('age');
    const ageNumber = rawAge ? Number(rawAge) : NaN;
    
    const imageFile = formData.get('image') as File;
    const acceptTerms = formData.get('acceptTerms') === 'on';

    const rawData = {
      name: formData.get('name') as string,
      age: ageNumber,
      email: formData.get('email') as string,
      gender: formData.get('gender') as string,
      country: formData.get('country') as string, 
      password: formData.get('password') as string, 
      confirmPassword: formData.get('confirmPassword') as string,
      acceptTerms,
      image: imageFile && imageFile.size > 0 ? imageFile : undefined,
    };

    const schema = createFormSchema(countries);
    const result = schema.safeParse(rawData);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = String(issue.path[0]);
        if (!errors[path]) {
          errors[path] = issue.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    try {
      setFormErrors({});
      const base64Image = await convertToBase64(imageFile);
      
      addSubmission({
        name: result.data.name,
        age: result.data.age,
        email: result.data.email,
        gender: result.data.gender as 'male' | 'female',
        country: result.data.country,
        imageBas64: base64Image, 
      });

      target.reset();
      if (countryInputRef.current) countryInputRef.current.value = ''; 
      onSuccess(); 
    } catch (error) {
      console.error('Error processing form submission:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label htmlFor="unc-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          id="unc-name"
          name="name"
          type="text"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
      </div>

      <div>
        <label htmlFor="unc-age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
        <input
          id="unc-age"
          name="age"
          type="number"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {formErrors.age && <p className="mt-1 text-xs text-red-500">{formErrors.age}</p>}
      </div>

      <div>
        <label htmlFor="unc-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          id="unc-email"
          name="email"
          type="email"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
      </div>

      <div>
        <label htmlFor="unc-gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
        <select
          id="unc-gender"
          name="gender"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {formErrors.gender && <p className="mt-1 text-xs text-red-500">{formErrors.gender}</p>}
      </div>

      <div>
        <input type="hidden" name="country" ref={countryInputRef} />
        <Combobox
          id="unc-country"
          label="Country"
          options={countries}
          onChange={(val) => {
            if (countryInputRef.current) countryInputRef.current.value = val;
          }}
          error={formErrors.country}
        />
      </div>

      <PasswordInput
        id="unc-password"
        name="password"
        label="Password"
        error={formErrors.password}
        showStrength={true}
      />

      <PasswordInput
        id="unc-confirmPassword"
        name="confirmPassword"
        label="Confirm Password"
        error={formErrors.confirmPassword}
      />

      <div>
        <label htmlFor="unc-image" className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
        <input
          id="unc-image"
          name="image"
          type="file"
          accept="image/jpeg,image/png"
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {formErrors.image && <p className="mt-1 text-xs text-red-500">{formErrors.image}</p>}
      </div>

      <div className="flex items-start py-2">
        <input
          id="unc-acceptTerms"
          name="acceptTerms"
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
        />
        <label htmlFor="unc-acceptTerms" className="ml-2 block text-sm text-gray-900">
          I accept the Terms and Conditions
        </label>
      </div>
      {formErrors.acceptTerms && <p className="text-xs text-red-500">{formErrors.acceptTerms}</p>}

      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        Submit (Uncontrolled)
      </button>
    </form>
  );
};
