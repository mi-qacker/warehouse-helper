import {NewShelfParams, useWarehouseStore} from '@/storages/warehouse-storage';
import {Button} from '@/ui/Button';
import {Input} from '@/ui/Input';
import {useCallback, useEffect, useRef, useState} from 'react';

export function ShelvingParams() {
  const shelving = useWarehouseStore(state => state.shelving);
  const addShelf = useWarehouseStore(state => state.addShelf);
  const updateShelf = useWarehouseStore(state => state.updateShelf);
  const removeShelf = useWarehouseStore(state => state.removeShelf);

  const [selectedShelfId, setSelectedShelfId] = useState<string | null>(null);
  const selectedShelf = shelving.find(shelf => shelf.id === selectedShelfId);

  const xInputRef = useRef<HTMLInputElement>(null);
  const yInputRef = useRef<HTMLInputElement>(null);
  const widthInputRef = useRef<HTMLInputElement>(null);
  const lengthInputRef = useRef<HTMLInputElement>(null);
  const heightInputRef = useRef<HTMLInputElement>(null);
  const levelsInputRef = useRef<HTMLInputElement>(null);

  // Set form values when a shelf is selected
  useEffect(() => {
    if (selectedShelf) {
      if (xInputRef.current)
        xInputRef.current.value = selectedShelf.x.toString();
      if (yInputRef.current)
        yInputRef.current.value = selectedShelf.y.toString();
      if (widthInputRef.current)
        widthInputRef.current.value = selectedShelf.width.toString();
      if (lengthInputRef.current)
        lengthInputRef.current.value = selectedShelf.length.toString();
      if (heightInputRef.current)
        heightInputRef.current.value = selectedShelf.height.toString();
      if (levelsInputRef.current)
        levelsInputRef.current.value = selectedShelf.levels.toString();
    }
  }, [selectedShelf]);

  const clearForm = useCallback(() => {
    if (xInputRef.current) xInputRef.current.value = '';
    if (yInputRef.current) yInputRef.current.value = '';
    if (widthInputRef.current) widthInputRef.current.value = '';
    if (lengthInputRef.current) lengthInputRef.current.value = '';
    if (heightInputRef.current) heightInputRef.current.value = '';
    if (levelsInputRef.current) levelsInputRef.current.value = '';
  }, []);

  const getFormValues = useCallback((): NewShelfParams => {
    const x = Number(xInputRef.current?.value || 0);
    const y = Number(yInputRef.current?.value || 0);
    const width = Number(widthInputRef.current?.value || 0);
    const length = Number(lengthInputRef.current?.value || 0);
    const height = Number(heightInputRef.current?.value || 0);
    const levels = Number(levelsInputRef.current?.value || 0);

    return {x, y, width, length, height, levels};
  }, []);

  const handleAddShelf = useCallback(() => {
    const newShelf = getFormValues();
    addShelf(newShelf);
    clearForm();
  }, [addShelf, getFormValues, clearForm]);

  const handleUpdateShelf = useCallback(() => {
    if (selectedShelfId) {
      const updatedShelf = getFormValues();
      updateShelf(selectedShelfId, updatedShelf);
      setSelectedShelfId(null);
      clearForm();
    }
  }, [selectedShelfId, updateShelf, getFormValues, clearForm]);

  const handleRemoveShelf = useCallback(() => {
    if (selectedShelfId) {
      removeShelf(selectedShelfId);
      setSelectedShelfId(null);
      clearForm();
    }
  }, [selectedShelfId, removeShelf, clearForm]);

  const handleCancelEdit = useCallback(() => {
    setSelectedShelfId(null);
    clearForm();
  }, [clearForm]);

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Параметры стеллажа</h3>

        <div className="grid grid-cols-2 gap-2">
          <Input
            label="X координата (м)"
            type="number"
            name="x"
            ref={xInputRef}
          />
          <Input
            label="Y координата (м)"
            type="number"
            name="y"
            ref={yInputRef}
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Input
            label="Ширина (м)"
            type="number"
            name="width"
            ref={widthInputRef}
          />
          <Input
            label="Длина (м)"
            type="number"
            name="length"
            ref={lengthInputRef}
          />
          <Input
            label="Высота (м)"
            type="number"
            name="height"
            ref={heightInputRef}
          />
        </div>

        <Input
          label="Количество уровней"
          type="number"
          name="levels"
          ref={levelsInputRef}
        />

        <div className="mt-2 flex gap-2">
          {!selectedShelfId ? (
            <Button onClick={handleAddShelf} label="Добавить стеллаж" />
          ) : (
            <>
              <Button onClick={handleUpdateShelf} label="Обновить" />
              <Button onClick={handleRemoveShelf} label="Удалить" color="red" />
              <Button onClick={handleCancelEdit} label="Отмена" color="amber" />
            </>
          )}
        </div>
      </div>

      {shelving.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 text-lg font-semibold">Список стеллажей</h3>
          <div className="flex flex-col gap-2">
            {shelving.map(shelf => (
              <div
                key={shelf.id}
                className={`cursor-pointer rounded border p-2 ${
                  selectedShelfId === shelf.id
                    ? 'border-blue-500 bg-blue-100'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedShelfId(shelf.id)}
              >
                <div className="flex justify-between">
                  <span>
                    Координаты: ({shelf.x}, {shelf.y})
                  </span>
                  <span>
                    Размеры: {shelf.width}×{shelf.length}×{shelf.height} м
                  </span>
                  <span>Уровней: {shelf.levels}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
