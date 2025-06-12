import {WAREHOUSE_INPUT_ID, WAREHOUSE_OUTPUT_ID} from '@/storages/init-data';
import {ZoneCondition, Cell, Warehouse, Product} from '@/storages/types';
import {point} from '@turf/turf';
import {BBox} from 'geojson';

export function generateCells(
  size: number,
  cellSize: number,
  spacing: number,
  warehouseWidth: number,
  zoneConditions: ZoneCondition[]
) {
  const cellsPerRow = Math.ceil(Math.sqrt(size));
  const cells: Cell[] = Array.from({length: size}, (_, i) => {
    const row = Math.floor(i / cellsPerRow);
    const col = i % cellsPerRow;
    const x = col * (cellSize + spacing);
    const y = row * (cellSize + spacing);
    const loadingX = Math.min(
      x + cellSize + spacing / 2,
      warehouseWidth - spacing / 2
    );
    const loadingY = y + cellSize / 2;
    return {
      id: `ID ${i}`,
      name: `Cell ${i}`,
      capacity: 100 + Math.random() * 900,
      zoneCondition:
        zoneConditions[Math.floor(Math.random() * zoneConditions.length)],
      bounds: [x, y, x + cellSize, y + cellSize] as BBox,
      loadingPoint: point([loadingX, loadingY], {}, {id: `ID ${i}`}),
    };
  });
  return cells;
}

export function generateWarehouse(
  warehouseWidth: number,
  warehouseHeight: number
): Warehouse {
  return {
    bounds: [0, 0, warehouseWidth, warehouseHeight],
    inputPoint: point([0, 0], {}, {id: WAREHOUSE_INPUT_ID}),
    outputPoint: point(
      [warehouseWidth, warehouseHeight],
      {},
      {id: WAREHOUSE_OUTPUT_ID}
    ),
  };
}

export function generateProducts(
  size: number,
  zoneConditions: ZoneCondition[]
): Product[] {
  return Array.from({length: size}, (_, i) => ({
    id: `ID ${i}`,
    name: `Product ${i}`,
    volume: Math.random() * 10,
    storageCondition:
      zoneConditions[Math.floor(Math.random() * zoneConditions.length)],
    incompatibleWith: [],
  }));
}
