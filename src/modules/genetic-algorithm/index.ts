import type TGenetic from 'genetic-js';
import {Cell, Placement, Product} from '@/storages/types';

let genetic: TGenetic.Genetic;
async function loadGenetic() {
  if (!genetic) {
    const Genetic = await import('genetic-js');
    genetic = Genetic.create();
    genetic.optimize = Genetic.Optimize.Minimize;
    genetic.select1 = Genetic.Select1.RandomLinearRank;
    genetic.select2 = Genetic.Select2.FittestRandom;
  }

  return genetic;
}

export async function solveOptimizationRoute(
  cells: Cell[],
  products: Product[],
  placement: Placement
) {
  const genetic = await loadGenetic();

  genetic.seed = function () {
    return [];
  };

  genetic.evolve({});
}

function getRandomSeed(cells: Cell[]): string[][] {
    
}
