import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Combobox } from './Combobox';

describe('Combobox Component', () => {
  const mockOptions = ['Belarus', 'Germany', 'Poland'];
  const mockOnChange = vi.fn();
  const defaultProps = {
    options: mockOptions,
    value: '',
    onChange: mockOnChange,
    id: 'country-select',
    label: 'Country',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render input field linked correctly with the label via htmlFor', () => {
    render(<Combobox {...defaultProps} />);

    const labelElement = screen.getByText('Country');
    const inputElement = screen.getByRole('textbox', { name: 'Country' });

    expect(labelElement).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('id', 'country-select');
  });

  it('should render the provided error message when the error prop is active', () => {
    render(<Combobox {...defaultProps} error="Invalid country selection" />);
    expect(screen.getByText('Invalid country selection')).toBeInTheDocument();
  });

  it('should open options dropdown list upon input focusing step', async () => {
    const user = userEvent.setup();
    render(<Combobox {...defaultProps} />);
    const inputElement = screen.getByRole('textbox', { name: 'Country' });

    expect(screen.queryByRole('list')).not.toBeInTheDocument();

    await user.click(inputElement); 

    expect(screen.getByText('Belarus')).toBeInTheDocument();
    expect(screen.getByText('Germany')).toBeInTheDocument();
    expect(screen.getByText('Poland')).toBeInTheDocument();
  });

  it('should filter options list reactively based on user typed value character sequence', async () => {
    const user = userEvent.setup();
    render(<Combobox {...defaultProps} />);
    const inputElement = screen.getByRole('textbox', { name: 'Country' });

    await user.type(inputElement, 'lan');

    expect(screen.getByText('Poland')).toBeInTheDocument();
    expect(screen.queryByText('Belarus')).not.toBeInTheDocument();
    expect(screen.queryByText('Germany')).not.toBeInTheDocument();
  });

  it('should call onChange, update input view and close overlay menu when a list option is clicked', async () => {
    const user = userEvent.setup();
    render(<Combobox {...defaultProps} />);
    const inputElement = screen.getByRole('textbox', { name: 'Country' });

    await user.click(inputElement);
    const targetOption = screen.getByText('Germany');
    await user.click(targetOption);

    expect(mockOnChange).toHaveBeenCalledWith('Germany');
    expect(screen.queryByText('Belarus')).not.toBeInTheDocument();
  });

  it('should safely reset temporary input string to last valid prop state when clicking outside container boundary', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <div data-testid="outside-area">Outside</div>
        <Combobox {...defaultProps} value="Belarus" />
      </div>
    );
    const inputElement = screen.getByRole('textbox', { name: 'Country' });

    await user.clear(inputElement);
    await user.type(inputElement, 'InvalidTxt');
    expect(inputElement).toHaveValue('InvalidTxt');

    await user.click(screen.getByTestId('outside-area'));

    expect(inputElement).toHaveValue('Belarus');
  });
});
