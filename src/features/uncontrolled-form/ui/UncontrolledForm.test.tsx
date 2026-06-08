import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, type  Mock } from 'vitest';
import { UncontrolledForm } from './UncontrolledForm';
import { useSubmissionStore } from '@/entities/submission/model/store';
import { convertToBase64, createFormSchema } from '@/shared/lib';

interface MockStore {
  countries: string[];
  addSubmission: Mock;
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

vi.mock('@/shared/lib', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/shared/lib')>();
  return {
    ...original,
    convertToBase64: vi.fn(),
    createFormSchema: vi.fn(),
  };
});

vi.mock('@/shared/ui/password-input/PasswordInput', () => {
  const MockPasswordInput = React.forwardRef<HTMLInputElement, MockPasswordInputProps>((props, ref) => {
    mockComponents.passwordRender(props);
    return (
      <div>
        <label htmlFor={props.id}>{props.label}</label>
        <input id={props.id} ref={ref} type="password" name={props.name} value={props.value} onChange={props.onChange} />
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

describe('UncontrolledForm Component', () => {
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
    (createFormSchema as unknown as Mock).mockReturnValue({
      safeParse: vi.fn()
    });

    render(<UncontrolledForm onSuccess={mockOnSuccess} />);

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

  it('should validate form only on submission and render errors if schema invalid', async () => {
    const user = userEvent.setup();
    
    (createFormSchema as unknown as Mock).mockReturnValue({
      safeParse: vi.fn().mockReturnValue({
        success: false,
        error: {
          issues: [
            { path: ['name'], message: 'Name error message' },
            { path: ['email'], message: 'Email error message' }
          ]
        }
      })
    });

    render(<UncontrolledForm onSuccess={mockOnSuccess} />);
    
    const submitBtn = screen.getByRole('button', { name: /Submit \(Uncontrolled\)/i });
    await user.click(submitBtn);

    expect(screen.getByText('Name error message')).toBeInTheDocument();
    expect(screen.getByText('Email error message')).toBeInTheDocument();
    expect(mockAddSubmission).not.toHaveBeenCalled();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('should submit form data successfully when schema checks pass', async () => {
    const user = userEvent.setup();
    const file = new File(['avatar content'], 'test.png', { type: 'image/png' });
    
    (convertToBase64 as unknown as Mock).mockResolvedValue('data:image/png;base64,uncontrolledstring');
    (createFormSchema as unknown as Mock).mockReturnValue({
      safeParse: vi.fn().mockReturnValue({
        success: true,
        data: {
          name: 'Jane',
          age: 25,
          email: 'jane@example.com',
          gender: 'female',
          country: 'Germany'
        }
      })
    });

    render(<UncontrolledForm onSuccess={mockOnSuccess} />);

    await user.type(screen.getByLabelText('Name'), 'Jane');
    await user.type(screen.getByLabelText('Age'), '25');
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.selectOptions(screen.getByLabelText('Gender'), 'female');
    await user.type(screen.getByLabelText('Country'), 'Germany');
    await user.type(screen.getByLabelText('Password'), 'SecurePass1!');
    await user.type(screen.getByLabelText('Confirm Password'), 'SecurePass1!');
    await user.click(screen.getByLabelText('I accept the Terms and Conditions'));
    await user.upload(screen.getByLabelText('Profile Image'), file);

    const submitBtn = screen.getByRole('button', { name: /Submit \(Uncontrolled\)/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(convertToBase64).toHaveBeenCalledWith(file);
      expect(mockAddSubmission).toHaveBeenCalledWith({
        name: 'Jane',
        age: 25,
        email: 'jane@example.com',
        gender: 'female',
        country: 'Germany',
        imageBas64: 'data:image/png;base64,uncontrolledstring'
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});
