import Genetic from 'genetic-js';

const genetic = Genetic.create();

genetic.select1 = Genetic.Select1.RandomLinearRank;
genetic.select2 = Genetic.Select2.FittestRandom;

export function solveOptimizationRoute() {}
