export interface BenchmarkResult {
  module: string;
  function: string;
  inputSize: number;
  iterations: number;
  times: number[];
}