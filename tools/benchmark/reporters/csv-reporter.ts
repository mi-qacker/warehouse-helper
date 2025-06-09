import type { BenchmarkResult } from '../types';

function calculateStats(times: number[]) {
  const avg = times.reduce((sum, t) => sum + t, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);
  
  const variance = times.reduce((sum, t) => sum + Math.pow(t - avg, 2), 0) / times.length;
  const stdDev = Math.sqrt(variance);
  
  return { avg, min, max, stdDev };
}

export function generateCsvReport(results: BenchmarkResult[]): string {
  const headers = [
    'Module',
    'Function',
    'InputSize',
    'Iterations',
    'AvgTime(ms)',
    'MinTime(ms)',
    'MaxTime(ms)',
    'StdDev'
  ].join(',');

  const rows = results.map(result => {
    const { avg, min, max, stdDev } = calculateStats(result.times);
    return [
      result.module,
      result.function,
      result.inputSize,
      result.iterations,
      avg.toFixed(2),
      min.toFixed(2),
      max.toFixed(2),
      stdDev.toFixed(2)
    ].join(',');
  });

  return [headers, ...rows].join('\n');
}