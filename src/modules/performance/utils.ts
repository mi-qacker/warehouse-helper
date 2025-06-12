import type {DistanceMatrix} from '@/app/api/distance-matrix';
import {
  createCellsDistanceMatrix,
  createPointDistanceMatrix,
} from '@/app/api/distance-matrix/create-distance-matrix';
import {solveOptimizationRoute} from '@/modules/genetic-algorithm';
import {
  createGraph,
  createRectangleGrid,
  filterGridByCollisions,
} from '@/modules/graph';
import {solveOptimizationPlacement} from '@/modules/lp-solver';
import {Cell, Product, Warehouse, ZoneCondition} from '@/storages/types';
import {bboxPolygon} from '@turf/turf';
import {Feature, Point} from 'geojson';
import {generateCells, generateWarehouse, generateProducts} from './generators';

/**
 * Generates test data for performance testing
 * @param module Module type: 'genetic' | 'lp' | 'graph'
 * @param size Size parameter (depends on module)
 */
export function generateTestData(module: 'genetic' | 'lp', size: number) {
  // Calculate warehouse dimensions based on cell count
  const cellSize = 5;
  const spacing = 5;
  const gridSize = Math.ceil(Math.sqrt(size));
  const warehouseWidth = gridSize * (cellSize + spacing) - spacing;
  const warehouseHeight = gridSize * (cellSize + spacing) - spacing;

  const warehouse: Warehouse = generateWarehouse(
    warehouseWidth,
    warehouseHeight
  );
  const zoneConditions: ZoneCondition[] = ['normal']; // for tests only 1 zone condition type

  switch (module) {
    case 'genetic': {
      const cells: Cell[] = generateCells(
        size,
        cellSize,
        spacing,
        warehouseWidth,
        zoneConditions
      );

      const grid = createRectangleGrid(warehouse.bounds, {
        width: 1,
        height: 1,
      });

      const filteredGrid = filterGridByCollisions(
        grid.features,
        cells.map(cell => bboxPolygon(cell.bounds))
      );
      const cellPoints = cells.map(cell => cell.loadingPoint);
      const graph = createGraph(
        filteredGrid,
        [warehouse.inputPoint, warehouse.outputPoint],
        cellPoints
      );

      const distanceMatrix: DistanceMatrix = {
        ...createPointDistanceMatrix(graph, warehouse, cells),
        ...createCellsDistanceMatrix(graph, cells),
      };

      return {
        cells,
        startPoint: warehouse.inputPoint,
        endPoint: warehouse.outputPoint,
        distanceMatrix,
      };
    }

    case 'lp': {
      const products: Product[] = generateProducts(size, zoneConditions);

      const cells: Cell[] = generateCells(
        size,
        cellSize,
        spacing,
        warehouseWidth,
        zoneConditions
      );

      const grid = createRectangleGrid([0, 0, 10, 10], {
        width: 1,
        height: 1,
      });

      const filteredGrid = filterGridByCollisions(
        grid.features,
        cells.map(cell => bboxPolygon(cell.bounds))
      );

      const cellPoints = cells.map(cell => cell.loadingPoint);
      const graph = createGraph(
        filteredGrid,
        [warehouse.inputPoint, warehouse.outputPoint],
        cellPoints
      );

      const distanceMatrix: DistanceMatrix = createPointDistanceMatrix(
        graph,
        warehouse,
        cells
      );

      return {
        products,
        cells,
        distanceMatrix,
        warehouse,
        warehousePoints: [warehouse.inputPoint, warehouse.outputPoint],
      };
    }

    default:
      throw new Error(`Unknown module type: ${module}`);
  }
}

/**
 * Runs performance test for specified module
 * @param module Module type: 'genetic' | 'lp' | 'graph'
 * @param inputData Input data for the module
 * @param iterations Number of iterations to average
 * @returns Average execution time in milliseconds
 */
export async function runPerformanceTest(
  module: 'genetic' | 'lp',
  inputData: unknown,
  iterations: number = 10
): Promise<number> {
  let totalTime = 0;

  try {
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();

      switch (module) {
        case 'genetic': {
          if (
            typeof inputData !== 'object' ||
            inputData === null ||
            !('cells' in inputData) ||
            !('startPoint' in inputData) ||
            !('endPoint' in inputData) ||
            !('distanceMatrix' in inputData)
          ) {
            throw new Error(
              'Genetic module requires {cells: Cell[], startPoint: Feature<Point>, endPoint: Feature<Point>, distanceMatrix: number[][]} input'
            );
          }
          // Проверка типов уже выполнена выше

          const {cells, startPoint, endPoint, distanceMatrix} = inputData as {
            cells: Cell[];
            startPoint: Feature<Point>;
            endPoint: Feature<Point>;
            distanceMatrix: DistanceMatrix;
          };
          await solveOptimizationRoute(
            cells,
            startPoint,
            endPoint,
            distanceMatrix
          );
          break;
        }
        case 'lp': {
          if (
            typeof inputData !== 'object' ||
            inputData === null ||
            !('products' in inputData) ||
            !('cells' in inputData)
          ) {
            throw new Error(
              'LP module requires {products: Product[], cells: Cell[]} input'
            );
          }
          // Проверка типов уже выполнена выше
          const {products, cells, distanceMatrix, warehousePoints} =
            inputData as {
              products: Product[];
              cells: Cell[];
              distanceMatrix: DistanceMatrix;
              warehousePoints: Feature<Point>[];
            };
          await solveOptimizationPlacement(
            products,
            cells,
            warehousePoints[0],
            distanceMatrix
          );
          break;
        }

        default:
          throw new Error(`Unknown module type: ${module}`);
      }

      const end = performance.now();
      totalTime += end - start;
    }

    return totalTime / iterations;
  } catch (error) {
    throw new Error(
      `Performance test failed for ${module}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
