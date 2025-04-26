import {Cell, Position} from '@/storages/types';
import {getPermutations} from './permutations';
import {getCellsDistance, getDistanceMatrix} from './distance-matrix';
import {getRandomIndex} from './random-index';

async function loadGenetic<TEntity, TUserData>() {
  const Genetic = await import('genetic-js');
  const genetic = Genetic.create<TEntity, TUserData>();
  genetic.optimize = Genetic.Optimize.Minimize;
  genetic.select1 = Genetic.Select1.Tournament2;
  genetic.select2 = Genetic.Select2.FittestRandom;

  return genetic;
}

export async function solveOptimizationRoute(
  cells: Cell[],
  startPoint: Position
) {
  const distanceMatrix = getDistanceMatrix(cells);
  const permutations = getPermutations(cells);

  const geneticUserData = {
    distanceMatrix,
    permutations,
    getRandomIndex,
    getCellsDistance,
    startPoint,
  };

  const genetic = await loadGenetic<Cell[], typeof geneticUserData>();

  genetic.seed = function () {
    const permutations = this.userData.permutations;
    const randomIndex = Math.floor(Math.random() * permutations.length);
    return permutations[randomIndex];
  };

  genetic.fitness = function (entity: Cell[]) {
    const distanceMatrix = this.userData.distanceMatrix;
    let dist = 0;
    entity.forEach((cell, i, cells) => {
      if (!cells[i - 1]) {
        dist += this.userData.getCellsDistance(
          this.userData.startPoint,
          cell.position
        );
        return;
      }
      const currCellId = cell.id;
      const prevCellId = cells[i - 1].id;

      dist += distanceMatrix[`${currCellId}-${prevCellId}`];
    });
    return dist;
  };

  genetic.mutate = function (entity) {
    const result = [...entity];

    const randomIndex1 = this.userData.getRandomIndex(entity);
    const randomIndex2 = this.userData.getRandomIndex(entity);

    const temp = result[randomIndex1];
    result[randomIndex1] = result[randomIndex2];
    result[randomIndex2] = temp;
    return result;
  };

  genetic.crossover = function (parent1, parent2) {
    const crossover = (reverse = false) => {
      const [first, second] = reverse ? [parent2, parent1] : [parent1, parent2];
      const randomIndex = this.userData.getRandomIndex(first);
      const result = first.slice(0, randomIndex);
      second.forEach(cell => {
        if (result.findIndex(({id}) => cell.id === id) === -1) {
          result.push(cell);
        }
      });
      return result;
    };
    return [crossover(), crossover(true)];
  };

  genetic.notification = function (pop, gen, stats, isFinished) {
    if (isFinished) {
      console.log({...pop[0], ...stats});
    }
  };

  genetic.evolve({size: permutations.length}, geneticUserData);
}
