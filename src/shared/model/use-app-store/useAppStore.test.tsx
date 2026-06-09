import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './useAppStore';

describe('useAppStore', () => {
  const mockPokemon = {
    id: 25,
    name: 'Pikachu',
    description: 'Mouse Pokémon',
    image: 'pikachu.png',
  };

  beforeEach(() => {
    useAppStore.setState({
      selectedItems: [],
    });
  });

  it('should have correct initial state', () => {
    const state = useAppStore.getState();
    expect(state.selectedItems).toEqual([]);
  });

  it('should add item object to selectedItems if it is not present via toggleSelectItem', () => {
    useAppStore.getState().toggleSelectItem(mockPokemon);

    const stateAfterAdd = useAppStore.getState();
    expect(stateAfterAdd.selectedItems).toEqual([mockPokemon]);
  });

  it('should remove item object from selectedItems if it is already present via toggleSelectItem', () => {
    useAppStore.setState({ selectedItems: [mockPokemon, { ...mockPokemon, id: 1, name: 'Bulbasaur' }] });

    useAppStore.getState().toggleSelectItem(mockPokemon);

    const stateAfterRemove = useAppStore.getState();
    expect(stateAfterRemove.selectedItems).toEqual([{ ...mockPokemon, id: 1, name: 'Bulbasaur' }]);
  });

  it('should support both number and string types for id in selectedItems within toggleSelectItem', () => {
    const stringIdPokemon = { ...mockPokemon, id: 'custom-id-1', name: 'Charmander' };

    useAppStore.getState().toggleSelectItem(mockPokemon);
    useAppStore.getState().toggleSelectItem(stringIdPokemon);

    const state = useAppStore.getState();
    expect(state.selectedItems).toEqual([mockPokemon, stringIdPokemon]);
  });

  it('should clear all selected items via clearSelection', () => {
    useAppStore.setState({ selectedItems: [mockPokemon, { ...mockPokemon, id: 1 }] });

    useAppStore.getState().clearSelection();

    const stateAfterClear = useAppStore.getState();
    expect(stateAfterClear.selectedItems).toEqual([]);
  });
});
