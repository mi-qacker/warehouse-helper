import { getPermutations } from '../genetic-algorithm/permutations';
import { createRectangleGrid } from '../graph/rectangle-grid';
import { NewProduct, NewCell, Cell, Product } from '@/storages/types';
import { loadGenetic } from '../genetic-algorithm/genetic';
import { solveOptimizationPlacement } from '../lp-solver';
import { Feature, Point } from 'geojson';
import { ZoneCondition } from '@/storages/types';

/**
 * Generates test data for performance testing
 * @param module Module type: 'genetic' | 'lp' | 'graph'
 * @param size Size parameter (depends on module)
 */
export function generateTestData(
  module: 'genetic' | 'lp' | 'graph',
  size: number
) {
  switch (module) {
    case 'genetic': {
      const sequence = Array.from({ length: size }, (_, i) => i);
      return getPermutations(sequence);
    }

    case 'lp': {
      const zoneConditions: ZoneCondition[] = ['cold', 'dry', 'normal'];
      
      const products: NewProduct[] = Array.from({ length: size }, (_, i) => ({
        name: `Product ${i}`,
        volume: Math.random() * 10,
        storageCondition: zoneConditions[Math.floor(Math.random() * zoneConditions.length)],
        incompatibleWith: [],
      }));

      const cells: NewCell[] = Array.from({ length: size }, (_, i) => ({
        name: `Cell ${i}`,
        capacity: 100 + Math.random() * 900,
        zoneCondition: zoneConditions[Math.floor(Math.random() * zoneConditions.length)],
        bounds: [0, 0, 10, 10] as [number, number, number, number],
        loadingPoint: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [5, 5],
          },
        }
      }));

      return { products, cells };
    }

    case 'graph': {
      const bounds: [number, number, number, number] = [0, 0, size, size];
      return createRectangleGrid(bounds, { width: 1, height: 1 });
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
  module: 'genetic' | 'lp' | 'graph',
  inputData: unknown,
  iterations: number = 10
): Promise<number> {
  let totalTime = 0;

  try {
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();

      switch (module) {
        case 'genetic': {
          if (!Array.isArray(inputData)) {
            throw new Error('Genetic module requires array input');
          }
          await loadGenetic();
          break;
        }
        case 'lp': {
          if (typeof inputData !== 'object' || inputData === null ||
              !('products' in inputData) || !('cells' in inputData)) {
            throw new Error('LP module requires {products: Product[], cells: Cell[]} input');
          }
          const { products, cells } = inputData as { products: Product[]; cells: Cell[] };
          const startPosition: Feature<Point> = {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [0, 0]
            }
          };
          await solveOptimizationPlacement(products, cells, startPosition, {});
          break;
        }
        case 'graph': {
          if (typeof inputData !== 'object' || inputData === null ||
              !('getNodes' in inputData)) {
            throw new Error('Graph module requires Graph input');
          }
          if (typeof inputData !== 'object' || inputData === null) {
            throw new Error('Graph module requires valid graph object');
          }
          // Минимальная реализация для теста производительности
          break;
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
    throw new Error(`Performance test failed for ${module}: ${error instanceof Error ? error.message : String(error)}`);
  }
}