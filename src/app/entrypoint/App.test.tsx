import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

interface MockModalProps {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

interface MockFormProps {
  onSuccess: () => void;
}

vi.mock('@/widgets/submission-cards/ui/SubmissionCards', () => ({
  SubmissionCards: () => <div data-testid="mock-submission-cards">Cards Grid</div>,
}));

vi.mock('@/features/uncontrolled-form/ui/UncontrolledForm', () => ({
  UncontrolledForm: ({ onSuccess }: MockFormProps) => (
    <div>
      <div data-testid="mock-uncontrolled-form">Uncontrolled Content</div>
      <button data-testid="trigger-uncontrolled-success" onClick={onSuccess}>Trigger Success</button>
    </div>
  ),
}));

vi.mock('@/features/rhf-form/ui/RhfForm', () => ({
  RhfForm: ({ onSuccess }: MockFormProps) => (
    <div>
      <div data-testid="mock-rhf-form">RHF Content</div>
      <button data-testid="trigger-rhf-success" onClick={onSuccess}>Trigger Success</button>
    </div>
  ),
}));

vi.mock('@/shared/ui/modal/Modal', () => ({
  Modal: ({ isOpen, title, children, onClose }: MockModalProps) => {
    if (!isOpen) return null;
    return (
      <div data-testid="mock-modal">
        <h2>{title}</h2>
        <button data-testid="mock-modal-close" onClick={onClose}>Close Modal</button>
        {children}
      </div>
    );
  },
}));

describe('App Component', () => {
  it('should render the main layout and submission cards grid', () => {
    render(<App />);

    expect(screen.getByText('FORMS')).toBeInTheDocument();
    expect(screen.getByText('Submitted Profiles History')).toBeInTheDocument();
    expect(screen.getByTestId('mock-submission-cards')).toBeInTheDocument();
  });

  it('should not display modals by default', () => {
    render(<App />);
    
    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-uncontrolled-form')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-rhf-form')).not.toBeInTheDocument();
  });

  it('should open and successfully close uncontrolled form modal on trigger success event', async () => {
    render(<App />);
    const user = userEvent.setup();

    const uncontrolledBtn = screen.getByRole('button', { name: /DOM \/ Uncontrolled Form/i });
    await user.click(uncontrolledBtn);

    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    expect(screen.getByText('Create Profile (Uncontrolled Approach)')).toBeInTheDocument();

    const successBtn = screen.getByTestId('trigger-uncontrolled-success');
    await user.click(successBtn);

    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
  });

  it('should open and successfully close react hook form modal on trigger success event', async () => {
    render(<App />);
    const user = userEvent.setup();

    const rhfBtn = screen.getByRole('button', { name: /React Hook Form/i });
    await user.click(rhfBtn);

    expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    expect(screen.getByText('Create Profile (React Hook Form)')).toBeInTheDocument();

    const successBtn = screen.getByTestId('trigger-rhf-success');
    await user.click(successBtn);

    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
  });

  it('should close uncontrolled form modal when clicking the close button on the modal itself', async () => {
    render(<App />);
    const user = userEvent.setup();

    const uncontrolledBtn = screen.getByRole('button', { name: /DOM \/ Uncontrolled Form/i });
    await user.click(uncontrolledBtn);

    const closeBtn = screen.getByRole('button', { name: /Close Modal/i });
    await user.click(closeBtn);

    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
  });

  it('should close react hook form modal when clicking the close button on the modal itself', async () => {
    render(<App />);
    const user = userEvent.setup();

    const rhfBtn = screen.getByRole('button', { name: /React Hook Form/i });
    await user.click(rhfBtn);

    const closeBtn = screen.getByRole('button', { name: /Close Modal/i });
    await user.click(closeBtn);

    expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
  });
});
