import {NewProduct, ZoneCondition} from '@/storages/types';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import {useState} from 'react';

export default function ProductForm() {
  const addProduct = useWarehouseStore(state => state.addProduct);
  // const updateProduct = useWarehouseStore(state => state.updateProduct);
  // const removeProduct = useWarehouseStore(state => state.removeProduct);

  const [formData, setFormData] = useState<NewProduct>({
    volume: 0,
    storageCondition: 'normal',
    incompatibleWith: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Объём (м³)</label>
        <input
          type="number"
          min="0"
          value={formData.volume}
          onChange={e =>
            setFormData({...formData, volume: Number(e.target.value)})
          }
        />
      </div>

      <div>
        <label>Условия хранения</label>
        <select
          value={formData.storageCondition}
          onChange={e =>
            setFormData({
              ...formData,
              storageCondition: e.target.value as ZoneCondition,
            })
          }
        >
          <option value="cold">Холодильная</option>
          <option value="dry">Сухая</option>
          <option value="normal">Обычная</option>
        </select>
      </div>

      <button type="submit">Добавить товар</button>
    </form>
  );
}
