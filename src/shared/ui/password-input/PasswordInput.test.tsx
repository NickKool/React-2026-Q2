import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { PasswordInput } from './PasswordInput';
import { calculatePasswordStrength } from '../../lib/passwordStrength';

vi.mock('../../lib/passwordStrength', () => ({
  calculatePasswordStrength: vi.fn(),
}));

describe('PasswordInput Component', () => {
  const mockOnChange = vi.fn();
  const defaultProps = {
    id: 'password-field',
    label: 'Password Label',
    onChange: mockOnChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (calculatePasswordStrength as Mock).mockReturnValue({
      hasDigit: false,
      hasUpper: false,
      hasLower: false,
      hasSpecial: false,
      score: 0,
    });
  });

  it('should render the input field and a properly connected label element via htmlFor', () => {
    render(<PasswordInput {...defaultProps} />);

    const labelElement = screen.getByText('Password Label');
    const inputElement = screen.getByLabelText('Password Label');

    expect(labelElement).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'password');
    expect(inputElement).toHaveAttribute('id', 'password-field');
  });

  it('should display the validation error message when the error prop contains text', () => {
    render(<PasswordInput {...defaultProps} error="Password is too weak" />);
    expect(screen.getByText('Password is too weak')).toBeInTheDocument();
  });

  it('should not display the strength indicator overlay if showStrength is false', async () => {
    const user = userEvent.setup();
    render(<PasswordInput {...defaultProps} showStrength={false} />);
    const inputElement = screen.getByLabelText('Password Label');

    await user.type(inputElement, 'Secret1!');

    expect(screen.queryByText(/Password strength:/i)).not.toBeInTheDocument();
  });

  it('should calculate strength and render progress bar using internal state when uncontrolled', async () => {
    const user = userEvent.setup();
    (calculatePasswordStrength as Mock).mockReturnValue({
      hasDigit: true,
      hasUpper: true,
      hasLower: true,
      hasSpecial: false,
      score: 3,
    });

    render(<PasswordInput {...defaultProps} showStrength={true} />);
    const inputElement = screen.getByLabelText('Password Label');

    await user.type(inputElement, 'abc');

    expect(calculatePasswordStrength).toHaveBeenCalledWith('abc');
    expect(screen.getByText('Password strength:')).toBeInTheDocument();
    expect(screen.getByText('3 / 4')).toBeInTheDocument();
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should dynamically append the correct tailwind background color class corresponding to computed score results', async () => {
    const user = userEvent.setup();
    
    (calculatePasswordStrength as Mock).mockReturnValue({ score: 1 });
    const { unmount: unmountWeak } = render(<PasswordInput {...defaultProps} showStrength={true} />);
    await user.type(screen.getByLabelText('Password Label'), 'w');
    let innerBar = screen.getByText(/Password strength:/i).previousElementSibling?.firstElementChild;
    expect(innerBar).toHaveClass('bg-red-500');
    unmountWeak();

    (calculatePasswordStrength as Mock).mockReturnValue({ score: 3 });
    const { unmount: unmountMedium } = render(<PasswordInput {...defaultProps} showStrength={true} />);
    await user.type(screen.getByLabelText('Password Label'), 'm');
    innerBar = screen.getByText(/Password strength:/i).previousElementSibling?.firstElementChild;
    expect(innerBar).toHaveClass('bg-yellow-500');
    unmountMedium();

    (calculatePasswordStrength as Mock).mockReturnValue({ score: 4 });
    render(<PasswordInput {...defaultProps} showStrength={true} />);
    await user.type(screen.getByLabelText('Password Label'), 's');
    innerBar = screen.getByText(/Password strength:/i).previousElementSibling?.firstElementChild;
    expect(innerBar).toHaveClass('bg-green-500');
  });

  it('should accept and forward standard HTML ref bindings down to the inner input element node', () => {
    const inputRef = React.createRef<HTMLInputElement>();
    render(<PasswordInput {...defaultProps} ref={inputRef} />);

    expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
    expect(inputRef.current).toHaveAttribute('id', 'password-field');
  });
});
