import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {WarehouseStore} from './types';

export const useWarehouseStore = create<WarehouseStore>()(
  persist(
    (set, get) => ({
      warehouse: {width: 16, length: 16},
      updateWarehouse: newParams => set({warehouse: newParams}),

      shelving: [],
      addShelf: newShelf =>
        set({
          shelving: [...get().shelving, {...newShelf, id: crypto.randomUUID()}],
        }),
      updateShelf: (id, updatedShelf) =>
        set({
          shelving: get().shelving.map(shelf =>
            shelf.id === id ? {...updatedShelf, id} : shelf
          ),
        }),
      removeShelf: id =>
        set({shelving: get().shelving.filter(shelf => shelf.id !== id)}),

      cargo: [],
      addCargo: newCargo =>
        set({
          cargo: [
            ...get().cargo,
            {
              ...newCargo,
              id: crypto.randomUUID(),
              shelfId: newCargo.shelfId ?? null,
              level: newCargo.level ?? null,
            },
          ],
        }),
      updateCargo: (id, updatedCargo) =>
        set({
          cargo: get().cargo.map(cargo =>
            cargo.id === id
              ? {
                  ...updatedCargo,
                  id,
                  shelfId: updatedCargo.shelfId ?? null,
                  level: updatedCargo.level ?? null,
                }
              : cargo
          ),
        }),
      removeCargo: id =>
        set({cargo: get().cargo.filter(cargo => cargo.id !== id)}),
    }),
    {
      name: 'warehouse-params',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
