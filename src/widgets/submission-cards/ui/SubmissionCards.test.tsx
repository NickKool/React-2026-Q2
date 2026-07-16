import { render, screen, act } from '@testing-library/react';
import { vi, type Mock } from 'vitest';
import { SubmissionCards } from './SubmissionCards';
import { useSubmissionStore, type SubmissionData } from '@/entities/submission/model/store';

interface MockStoreState {
  submissions: SubmissionData[];
  latestSubmissionId: string | null;
  setLatestSubmissionId: Mock;
}

vi.mock('@/entities/submission/model/store', () => ({
  useSubmissionStore: vi.fn(),
}));

describe('SubmissionCards Component', () => {
  const mockSetLatestSubmissionId = vi.fn();

  const mockSubmissions: SubmissionData[] = [
    {
      id: 'uuid-1',
      name: 'John Doe',
      age: 30,
      email: 'john@example.com',
      gender: 'male',
      country: 'Germany',
      imageBas64: 'data:image/png;base64,mock1',
      timestamp: 123456,
    },
    {
      id: 'uuid-2',
      name: 'Jane Smith',
      age: 25,
      email: 'jane@example.com',
      gender: 'female',
      country: 'Poland',
      imageBas64: 'data:image/png;base64,mock2',
      timestamp: 123457,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render placeholder message when submission list state is completely empty', () => {
    (useSubmissionStore as unknown as Mock).mockReturnValue({
      submissions: [],
      latestSubmissionId: null,
      setLatestSubmissionId: mockSetLatestSubmissionId,
    } as MockStoreState);

    render(<SubmissionCards />);

    expect(
      screen.getByText('Submission history is empty. Open a form and submit your first profile!')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('submission-card')).not.toBeInTheDocument();
  });

  it('should render proper data cards list reflecting provided items layout grid', () => {
    (useSubmissionStore as unknown as Mock).mockReturnValue({
      submissions: mockSubmissions,
      latestSubmissionId: null,
      setLatestSubmissionId: mockSetLatestSubmissionId,
    } as MockStoreState);

    render(<SubmissionCards />);

    expect(screen.queryByText(/Submission history is empty/i)).not.toBeInTheDocument();
    
    const cards = screen.getAllByTestId('submission-card');
    expect(cards).toHaveLength(2);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Age: 30')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Germany')).toBeInTheDocument();

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Age: 25')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('Female')).toBeInTheDocument();
    expect(screen.getByText('Poland')).toBeInTheDocument();
  });

  it('should append active yellow highlight modifier classes only on newly submitted item records', () => {
    (useSubmissionStore as unknown as Mock).mockReturnValue({
      submissions: mockSubmissions,
      latestSubmissionId: 'uuid-1',
      setLatestSubmissionId: mockSetLatestSubmissionId,
    } as MockStoreState);

    render(<SubmissionCards />);

    const cards = screen.getAllByTestId('submission-card');
    
    expect(cards[0]).toHaveClass('bg-yellow-50');
    expect(cards[0]).toHaveClass('border-yellow-400');
    expect(cards[0]).toHaveClass('ring-yellow-100');

    expect(cards[1]).not.toHaveClass('bg-yellow-50');
    expect(cards[1]).not.toHaveClass('border-yellow-400');
    expect(cards[1]).not.toHaveClass('ring-yellow-100');
  });

  it('should clear latest submission tracking state id asynchronously after exactly 3000ms delay steps', () => {
    (useSubmissionStore as unknown as Mock).mockReturnValue({
      submissions: mockSubmissions,
      latestSubmissionId: 'uuid-1',
      setLatestSubmissionId: mockSetLatestSubmissionId,
    } as MockStoreState);

    render(<SubmissionCards />);

    expect(mockSetLatestSubmissionId).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(mockSetLatestSubmissionId).toHaveBeenCalledWith(null);
    expect(mockSetLatestSubmissionId).toHaveBeenCalledTimes(1);
  });
});
