import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal Component', () => {
  const mockOnClose = vi.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    title: 'Test Modal Title',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render nothing when isOpen is false', () => {
    render(
      <Modal {...defaultProps} isOpen={false}>
        <div>Modal Body Content</div>
      </Modal>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Modal Title')).not.toBeInTheDocument();
  });

  it('should render correct title, children content, and accessible dialog attributes when open', () => {
    render(
      <Modal {...defaultProps}>
        <div data-testid="modal-content">Modal Body Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    expect(screen.getByText('Test Modal Title')).toBeInTheDocument();
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
  });

  it('should call onClose when clicking the cross close button', async () => {
    const user = userEvent.setup();
    render(
      <Modal {...defaultProps}>
        <div>Content</div>
      </Modal>
    );

    const closeBtn = screen.getByRole('button', { name: /Close the modal window/i });
    await user.click(closeBtn);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when clicking on the overlay container backdrop background', async () => {
    const user = userEvent.setup();
    render(
      <Modal {...defaultProps}>
        <div data-testid="inner-content">Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    const overlay = dialog.parentElement;
    expect(overlay).toBeInTheDocument();

    if (overlay) {
      await user.click(overlay);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('should not call onClose when clicking inside the white modal content area dialog container', async () => {
    const user = userEvent.setup();
    render(
      <Modal {...defaultProps}>
        <button data-testid="inner-button">Inner Action</button>
      </Modal>
    );

    const innerButton = screen.getByTestId('inner-button');
    await user.click(innerButton);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should trigger onClose call when user presses the Escape keyboard key', () => {
    render(
      <Modal {...defaultProps}>
        <div>Content</div>
      </Modal>
    );

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should manage and move active HTML focus onto the dialog node upon opening state', () => {
    render(
      <Modal {...defaultProps}>
        <div>Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveFocus();
  });

  it('should update body overflow style to hidden on open and restore it on close or component unmount', () => {
    const { unmount } = render(
      <Modal {...defaultProps}>
        <div>Content</div>
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('');
  });
});
