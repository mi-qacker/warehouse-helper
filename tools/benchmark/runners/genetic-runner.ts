import type { WarehouseStore } from '../types';
import { solveOptimizationRoute } from '../../../src/modules/genetic-algorithm/genetic';
import type { DistanceMatrix, DistanceBody } from '@/app/api/distance-matrix';

// Заглушка матрицы расстояний
const createDistanceMatrixStub = (): DistanceMatrix => {
  const matrix: Record<string, DistanceBody> = {};
  
  // Генерация случайных расстояний
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      if (i !== j) {
        const key = `point-${i}-point-${j}`;
        matrix[key] = {
          distance: Math.floor(Math.random() * 100) + 10,
          path: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [[0, 0], [1, 1]]
            },
            properties: {}
          }
        };
      }
    }
  }
  
  return matrix as DistanceMatrix;
};

export async function runGeneticBenchmark(
  data: WarehouseStore,
  iterations: number
): Promise<number[]> {
  const distanceMatrix = createDistanceMatrixStub();
  const executionTimes: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    
    await solveOptimizationRoute(
      data.cells,
      data.warehouse.inputPoint,
      data.warehouse.outputPoint,
      distanceMatrix
    );

    const endTime = performance.now();
    executionTimes.push(endTime - startTime);
  }

  return executionTimes;
}