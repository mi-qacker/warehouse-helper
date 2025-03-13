import {NewCargoParams} from '@/storages/types';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import {Button} from '@/ui/Button';
import {Input} from '@/ui/Input';
import {useCallback, useEffect, useRef, useState} from 'react';

export function CargoParams() {
  const cargo = useWarehouseStore(state => state.cargo);
  const addCargo = useWarehouseStore(state => state.addCargo);
  const updateCargo = useWarehouseStore(state => state.updateCargo);
  const removeCargo = useWarehouseStore(state => state.removeCargo);

  const [selectedCargoId, setSelectedCargoId] = useState<string | null>(null);
  const selectedCargo = cargo.find(c => c.id === selectedCargoId);

  const widthInputRef = useRef<HTMLInputElement>(null);
  const lengthInputRef = useRef<HTMLInputElement>(null);
  const heightInputRef = useRef<HTMLInputElement>(null);
  const weightInputRef = useRef<HTMLInputElement>(null);

  // Set form values when a cargo is selected
  useEffect(() => {
    if (selectedCargo) {
      if (widthInputRef.current)
        widthInputRef.current.value = selectedCargo.width.toString();
      if (lengthInputRef.current)
        lengthInputRef.current.value = selectedCargo.length.toString();
      if (heightInputRef.current)
        heightInputRef.current.value = selectedCargo.height.toString();
      if (weightInputRef.current)
        weightInputRef.current.value = selectedCargo.weight.toString();
    }
  }, [selectedCargo]);

  const clearForm = useCallback(() => {
    if (widthInputRef.current) widthInputRef.current.value = '';
    if (lengthInputRef.current) lengthInputRef.current.value = '';
    if (heightInputRef.current) heightInputRef.current.value = '';
    if (weightInputRef.current) weightInputRef.current.value = '';
  }, []);

  const getFormValues = useCallback((): NewCargoParams => {
    const width = Number(widthInputRef.current?.value ?? 0);
    const length = Number(lengthInputRef.current?.value ?? 0);
    const height = Number(heightInputRef.current?.value ?? 0);
    const weight = Number(weightInputRef.current?.value ?? 0);

    return {width, length, height, weight};
  }, []);

  const handleAddCargo = useCallback(() => {
    const newCargo = getFormValues();
    addCargo(newCargo);
    clearForm();
  }, [addCargo, getFormValues, clearForm]);

  const handleUpdateCargo = useCallback(() => {
    if (selectedCargoId) {
      const updatedCargo = getFormValues();
      updateCargo(selectedCargoId, updatedCargo);
      setSelectedCargoId(null);
      clearForm();
    }
  }, [selectedCargoId, updateCargo, getFormValues, clearForm]);

  const handleRemoveCargo = useCallback(() => {
    if (selectedCargoId) {
      removeCargo(selectedCargoId);
      setSelectedCargoId(null);
      clearForm();
    }
  }, [selectedCargoId, removeCargo, clearForm]);

  const handleCancelEdit = useCallback(() => {
    setSelectedCargoId(null);
    clearForm();
  }, [clearForm]);

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Параметры груза</h3>

        <div className="grid grid-cols-3 gap-2">
          <Input
            tabIndex={1}
            label="Ширина (м)"
            type="number"
            name="width"
            ref={widthInputRef}
          />
          <Input
            tabIndex={2}
            label="Длина (м)"
            type="number"
            name="length"
            ref={lengthInputRef}
          />
          <Input
            tabIndex={3}
            label="Высота (м)"
            type="number"
            name="height"
            ref={heightInputRef}
          />
        </div>

        <Input
          tabIndex={4}
          label="Вес (кг)"
          type="number"
          name="weight"
          ref={weightInputRef}
        />

        <div className="mt-2 flex gap-2">
          {!selectedCargoId ? (
            <Button onClick={handleAddCargo} label="Добавить груз" />
          ) : (
            <>
              <Button onClick={handleUpdateCargo} label="Обновить" />
              <Button onClick={handleRemoveCargo} label="Удалить" color="red" />
              <Button onClick={handleCancelEdit} label="Отмена" color="amber" />
            </>
          )}
        </div>
      </div>

      {cargo.length > 0 && (
        <div className="mt-4">
          <h3 className="mb-2 text-lg font-semibold">Список грузов</h3>
          <div className="flex flex-col gap-2">
            {cargo.map(c => (
              <div
                key={c.id}
                className={`cursor-pointer rounded border p-2 ${
                  selectedCargoId === c.id
                    ? 'border-blue-500 bg-blue-100'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedCargoId(c.id)}
              >
                <div className="flex justify-between">
                  <span>
                    Размеры: {c.width}×{c.length}×{c.height} м
                  </span>
                  <span>Вес: {c.weight} кг</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
