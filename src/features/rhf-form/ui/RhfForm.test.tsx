import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi,type  Mock } from 'vitest';
import { type ResolverResult, type FieldValues } from 'react-hook-form';
import { RhfForm } from './RhfForm';
import { useSubmissionStore } from '@/entities/submission/model/store';
import { convertToBase64} from '@/shared/lib';
import * as zodResolverModule from '@hookform/resolvers/zod';

interface MockStore {
  countries: string[];
  addSubmission: Mock;
}

interface HookFormValues extends FieldValues {
  name?: string;
  age?: number;
  email?: string;
  gender?: string;
  country?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: boolean;
  image?: unknown;
}

interface MockPasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showStrength?: boolean;
}

interface MockComboboxProps {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const mockComponents = vi.hoisted(() => {
  return {
    passwordRender: vi.fn(),
    comboboxRender: vi.fn()
  };
});

vi.mock('@/entities/submission/model/store', () => ({
  useSubmissionStore: vi.fn(),
}));

vi.mock('@hookform/resolvers/zod', { spy: true });

vi.mock('@/shared/lib', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/shared/lib')>();
  return {
    ...original,
    convertToBase64: vi.fn(),
  };
});

vi.mock('@/shared/ui/password-input/PasswordInput', () => {
  const MockPasswordInput = React.forwardRef<HTMLInputElement, MockPasswordInputProps>((props, ref) => {
    mockComponents.passwordRender(props);
    return (
      <div>
        <label htmlFor={props.id}>{props.label}</label>
        <input id={props.id} ref={ref} type="password" {...props} />
        {props.error && <p>{props.error}</p>}
      </div>
    );
  });
  MockPasswordInput.displayName = 'PasswordInput';
  
  return { PasswordInput: MockPasswordInput };
});

vi.mock('@/shared/ui/combobox/Combobox', () => {
  const MockCombobox = (props: MockComboboxProps) => {
    mockComponents.comboboxRender(props);
    return (
      <div>
        <label htmlFor={props.id}>{props.label}</label>
        <input id={props.id} value={props.value} onChange={(e) => props.onChange(e.target.value)} />
        {props.error && <p>{props.error}</p>}
      </div>
    );
  };
  
  return { Combobox: MockCombobox };
});

describe('RhfForm Component', () => {
  const mockAddSubmission = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockCountries = ['Belarus', 'Germany'];

  beforeEach(() => {
    vi.clearAllMocks();
    (useSubmissionStore as unknown as Mock).mockReturnValue({
      countries: mockCountries,
      addSubmission: mockAddSubmission,
    } as MockStore);
  });

  it('should render all form fields and labels', () => {
    render(<RhfForm onSuccess={mockOnSuccess} />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Profile Image')).toBeInTheDocument();
    expect(screen.getByLabelText('I accept the Terms and Conditions')).toBeInTheDocument();
  });

  it('should disable submit button by default due to strict real-time validation', () => {
    render(<RhfForm onSuccess={mockOnSuccess} />);
    const submitBtn = screen.getByRole('button', { name: /Submit \(React Hook Form\)/i });
    expect(submitBtn).toBeDisabled();
  });

  it('should enable submit button and handle submission successfully when inputs are valid', async () => {
    const user = userEvent.setup();
    (convertToBase64 as unknown as Mock).mockResolvedValue('data:image/png;base64,mockstring');

    vi.mocked(zodResolverModule.zodResolver).mockImplementation(() => async (values: unknown): Promise<ResolverResult<FieldValues>> => {
      const formValues = values as HookFormValues;
      if (
        formValues.name === 'John' &&
        formValues.age === 30 &&
        formValues.email === 'john@example.com' &&
        formValues.gender === 'male' &&
        formValues.country === 'Germany' &&
        formValues.password === 'Password123!' &&
        formValues.confirmPassword === 'Password123!' &&
        formValues.acceptTerms === true &&
        formValues.image
      ) {
        return { values: formValues, errors: {} };
      }
      return { 
        values: {}, 
        errors: { 
          name: { message: 'Invalid inputs', type: 'validation' } 
        } 
      };
    });

    render(<RhfForm onSuccess={mockOnSuccess} />);

    await user.type(screen.getByLabelText('Name'), 'John');
    await user.type(screen.getByLabelText('Age'), '30');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');
    await user.selectOptions(screen.getByLabelText('Gender'), 'male');
    await user.type(screen.getByLabelText('Country'), 'Germany');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Password123!');
    await user.click(screen.getByLabelText('I accept the Terms and Conditions'));

    const file = new File(['mock content'], 'avatar.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText('Profile Image');
    await user.upload(fileInput, file);

    const submitBtn = screen.getByRole('button', { name: /Submit \(React Hook Form\)/i });
    
    await waitFor(() => {
      expect(submitBtn).not.toBeDisabled();
    });

    await user.click(submitBtn);

    await waitFor(() => {
      expect(convertToBase64).toHaveBeenCalledWith(file);
      expect(mockAddSubmission).toHaveBeenCalledWith({
        name: 'John',
        age: 30,
        email: 'john@example.com',
        gender: 'male',
        country: 'Germany',
        imageBas64: 'data:image/png;base64,mockstring',
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});
