import {Field, Label, Select} from '@headlessui/react';
import {NewCargoParams, ShelfParams} from '@/storages/types';
import {useWarehouseStore} from '@/storages/warehouse-storage';
import {Button} from '@/ui/Button';
import {Input} from '@/ui/Input';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';

// Функция для проверки возможности размещения груза на стеллаже
function canPlaceCargo(
  cargoWidth: number,
  cargoLength: number,
  cargoHeight: number,
  shelf: ShelfParams
): {
  canPlace: boolean;
  needRotation: boolean;
  message: string;
} {
  const levelHeight = shelf.height / shelf.levels;

  // Проверка высоты
  if (cargoHeight > levelHeight) {
    return {
      canPlace: false,
      needRotation: false,
      message: `Высота груза (${cargoHeight} м) превышает высоту уровня стеллажа (${levelHeight.toFixed(
        2
      )} м)`,
    };
  }

  // Проверка размеров без поворота
  const fitsWithoutRotation =
    cargoWidth <= shelf.width && cargoLength <= shelf.length;

  // Проверка размеров с поворотом
  const fitsWithRotation =
    cargoWidth <= shelf.length && cargoLength <= shelf.width;

  if (fitsWithoutRotation) {
    return {
      canPlace: true,
      needRotation: false,
      message: 'Груз помещается на стеллаж',
    };
  } else if (fitsWithRotation) {
    return {
      canPlace: true,
      needRotation: true,
      message: 'Груз помещается на стеллаж при повороте на 90°',
    };
  } else {
    return {
      canPlace: false,
      needRotation: false,
      message: `Груз не помещается на стеллаж (${shelf.width}x${shelf.length} м)`,
    };
  }
}

export function CargoParams() {
  const cargo = useWarehouseStore(state => state.cargo);
  const shelving = useWarehouseStore(state => state.shelving);
  const addCargo = useWarehouseStore(state => state.addCargo);
  const updateCargo = useWarehouseStore(state => state.updateCargo);
  const removeCargo = useWarehouseStore(state => state.removeCargo);

  const [selectedCargoId, setSelectedCargoId] = useState<string | null>(null);
  const selectedCargo = cargo.find(c => c.id === selectedCargoId);

  const [selectedShelfId, setSelectedShelfId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null
  );

  const widthInputRef = useRef<HTMLInputElement>(null);
  const lengthInputRef = useRef<HTMLInputElement>(null);
  const heightInputRef = useRef<HTMLInputElement>(null);
  const weightInputRef = useRef<HTMLInputElement>(null);

  // Получаем выбранный стеллаж
  const selectedShelf = useMemo(() => {
    if (!selectedShelfId) return null;
    return shelving.find(s => s.id === selectedShelfId) || null;
  }, [selectedShelfId, shelving]);

  // Максимальное количество уровней для выбранного стеллажа
  const maxLevels = useMemo(() => {
    return selectedShelf ? selectedShelf.levels : 0;
  }, [selectedShelf]);

  // Валидация размещения груза на стеллаже
  useEffect(() => {
    if (!selectedShelf) {
      setValidationMessage(null);
      return;
    }

    const width = Number(widthInputRef.current?.value ?? 0);
    const length = Number(lengthInputRef.current?.value ?? 0);
    const height = Number(heightInputRef.current?.value ?? 0);

    if (width && length && height) {
      const validation = canPlaceCargo(width, length, height, selectedShelf);
      setValidationMessage(validation.message);
    } else {
      setValidationMessage(null);
    }
  }, [selectedShelf, widthInputRef, lengthInputRef, heightInputRef]);

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

      setSelectedShelfId(selectedCargo.shelfId);
      setSelectedLevel(selectedCargo.level);
    } else {
      setSelectedShelfId(null);
      setSelectedLevel(null);
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

    return {
      width,
      length,
      height,
      weight,
      shelfId: selectedShelfId,
      level: selectedLevel,
    };
  }, [selectedShelfId, selectedLevel]);

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

        <Field className="mt-2">
          <Label className="text-sm">Стеллаж (необязательно)</Label>
          <Select
            className="block w-full rounded-lg border-2 border-neutral-200 px-2 py-2 focus:outline-none"
            value={selectedShelfId || ''}
            onChange={e => setSelectedShelfId(e.target.value || null)}
            aria-label="Выбор стеллажа"
          >
            <option value="">Не выбран</option>
            {shelving.map(shelf => (
              <option key={shelf.id} value={shelf.id}>
                Стеллаж #{shelf.id.slice(0, 6)} ({shelf.width}×{shelf.length}×
                {shelf.height} м)
              </option>
            ))}
          </Select>
        </Field>

        {selectedShelf && (
          <Field className="mt-2">
            <Label className="text-sm">Уровень стеллажа</Label>
            <Select
              className="block w-full rounded-lg border-2 border-neutral-200 px-2 py-2 focus:outline-none"
              value={selectedLevel !== null ? selectedLevel.toString() : ''}
              onChange={e =>
                setSelectedLevel(
                  e.target.value !== '' ? Number(e.target.value) : null
                )
              }
              aria-label="Выбор уровня стеллажа"
            >
              <option value="">Не выбран</option>
              {Array.from({length: maxLevels}, (_, i) => (
                <option key={i} value={i.toString()}>
                  Уровень {i + 1} (высота{' '}
                  {(selectedShelf.height / maxLevels).toFixed(2)} м)
                </option>
              ))}
            </Select>
          </Field>
        )}

        {validationMessage && (
          <div
            className={`mt-2 rounded-md p-2 ${
              validationMessage.includes('не помещается') ||
              validationMessage.includes('превышает')
                ? 'bg-red-100 text-red-800'
                : validationMessage.includes('при повороте')
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
            }`}
          >
            {validationMessage}
          </div>
        )}

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
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span>
                      Размеры: {c.width}×{c.length}×{c.height} м
                    </span>
                    <span>Вес: {c.weight} кг</span>
                  </div>
                  {c.shelfId && (
                    <div className="text-sm text-gray-600">
                      <span>
                        Стеллаж: #{c.shelfId.slice(0, 6)}
                        {c.level !== null && `, Уровень: ${c.level + 1}`}
                      </span>
                    </div>
                  )}
                  {!c.shelfId && (
                    <div className="text-sm text-amber-600">
                      Не размещен на стеллаже
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
