import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface PokemonData {
  id: number | string;
  name: string;
  description: string;
  image: string;
}

interface AppState {
  selectedItems: PokemonData[];
  toggleSelectItem: (item: PokemonData) => void;
  clearSelection: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      selectedItems: [],
      toggleSelectItem: (item) =>
        set(
          (state) => {
            const isAlreadySelected = state.selectedItems.some((i) => String(i.id) === String(item.id));
            const newSelectedItems = isAlreadySelected
              ? state.selectedItems.filter((i) => String(i.id) !== String(item.id))
              : [...state.selectedItems, item];

            return { selectedItems: newSelectedItems };
          },
          false,
          'items/toggleSelect'
        ),
      clearSelection: () => set({ selectedItems: [] }, false, 'items/clearSelection'),
    }),
    { name: 'AppStore' }
  )
);
