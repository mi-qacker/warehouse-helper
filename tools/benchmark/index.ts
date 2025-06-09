import { generateStressData } from './generators/data-generator';
import { runGeneticBenchmark } from './runners/genetic-runner';
import { generateCsvReport } from './reporters/csv-reporter';
import type { BenchmarkResult } from './types';

async function main() {
  const args = process.argv.slice(2);
  const inputSize = parseInt(args.find(arg => arg.startsWith('--input-size='))?.split('=')[1] || '1');
  const iterations = parseInt(args.find(arg => arg.startsWith('--iterations='))?.split('=')[1] || '10');
  
  // eslint-disable-next-line no-console
  console.log(`Running benchmark with input size: ${inputSize}, iterations: ${iterations}`);
  
  // Генерация тестовых данных
  const testData = generateStressData(inputSize);
  
  const results: BenchmarkResult[] = [];
  
  // Запуск бенчмарка для генетического алгоритма
  const geneticTimes = await runGeneticBenchmark(testData, iterations);
  results.push({
    module: 'genetic-algorithm',
    function: 'solveOptimizationRoute',
    inputSize,
    iterations,
    times: geneticTimes
  });
  
  // TODO: Добавить вызовы для других модулей (graph, lp-solver)
  
  // Генерация отчета
  const csvReport = generateCsvReport(results);
  // eslint-disable-next-line no-console
  console.log(csvReport);
}

main().catch(error => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});