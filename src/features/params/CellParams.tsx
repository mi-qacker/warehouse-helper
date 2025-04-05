import {NewCell, ZoneCondition} from '@/storages/types';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import {useState} from 'react';

export default function CellForm() {
  const addCell = useWarehouseStore(state => state.addCell);
  // const updateCell = useWarehouseStore(state => state.updateCell);
  // const removeCell = useWarehouseStore(state => state.removeCell);

  const [formData, setFormData] = useState<NewCell>({
    capacity: 0,
    zoneCondition: 'normal',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCell(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Вместимость (м³)</label>
        <input
          type="number"
          min="0"
          value={formData.capacity}
          onChange={e =>
            setFormData({...formData, capacity: Number(e.target.value)})
          }
        />
      </div>

      <div>
        <label>Зона хранения</label>
        <select
          value={formData.zoneCondition}
          onChange={e =>
            setFormData({
              ...formData,
              zoneCondition: e.target.value as ZoneCondition,
            })
          }
        >
          <option value="cold">Холодильная</option>
          <option value="dry">Сухая</option>
          <option value="normal">Обычная</option>
        </select>
      </div>

      <button type="submit">Добавить ячейку</button>
    </form>
  );
}
