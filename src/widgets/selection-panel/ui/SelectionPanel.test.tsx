import { render, screen, fireEvent } from '@testing-library/react';
import { SelectionPanel } from './SelectionPanel';
import { useAppStore } from '@/shared/model';
import { downloadCsv } from '@/shared/lib';
import { describe, it, expect, vi, beforeEach } from 'vitest';

type AppState = Parameters<typeof useAppStore> extends (state: infer S) => unknown ? S : never;
type StoreMock = <T>(selector: (state: AppState) => T) => T;

vi.mock('@/shared/model', () => ({
  useAppStore: vi.fn<StoreMock>(),
}));

vi.mock('@/shared/lib', () => ({
  downloadCsv: vi.fn(),
}));

describe('SelectionPanel', () => {
  const mockSelectedItems = [
    { id: 25, name: 'Pikachu', description: 'Electric', image: 'pikachu.png' },
    { id: '1', name: 'Bulbasaur', description: 'Grass', image: 'bulbasaur.png' },
  ];

  const mockClearSelection = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null (render nothing) when selectedItems is empty', () => {
    vi.mocked(useAppStore).mockImplementation(
      <T,>(selector: (state: AppState) => T): T =>
        selector({
          selectedItems: [],
          clearSelection: mockClearSelection,
        } as unknown as AppState)
    );

    const { container } = render(<SelectionPanel />);
    expect(container.firstChild).toBeNull();
  });

  it('should correctly display the count of selected items', () => {
    vi.mocked(useAppStore).mockImplementation(
      <T,>(selector: (state: AppState) => T): T =>
        selector({
          selectedItems: mockSelectedItems,
          clearSelection: mockClearSelection,
        } as unknown as AppState)
    );

    render(<SelectionPanel />);

    expect(screen.getByText('Selected items:')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should call clearSelection when "Unselect All" button is clicked', () => {
    vi.mocked(useAppStore).mockImplementation(
      <T,>(selector: (state: AppState) => T): T =>
        selector({
          selectedItems: [mockSelectedItems[0]],
          clearSelection: mockClearSelection,
        } as unknown as AppState)
    );

    render(<SelectionPanel />);

    const clearButton = screen.getByRole('button', { name: /unselect all/i });
    fireEvent.click(clearButton);

    expect(mockClearSelection).toHaveBeenCalledTimes(1);
  });

  it('should trigger downloadCsv with selected items when "Download" is clicked', () => {
    vi.mocked(useAppStore).mockImplementation(
      <T,>(selector: (state: AppState) => T): T =>
        selector({
          selectedItems: mockSelectedItems,
          clearSelection: mockClearSelection,
        } as unknown as AppState)
    );

    render(<SelectionPanel />);

    const downloadButton = screen.getByRole('button', { name: /download/i });
    fireEvent.click(downloadButton);

    expect(downloadCsv).toHaveBeenCalledTimes(1);
    expect(downloadCsv).toHaveBeenCalledWith(mockSelectedItems);
  });
});
