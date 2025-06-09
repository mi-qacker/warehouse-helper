import type { WarehouseStore } from '../../src/storages/types';

export interface BenchmarkResult {
  module: string;
  function: string;
  inputSize: number;
  iterations: number;
  times: number[];
}

export type { WarehouseStore };