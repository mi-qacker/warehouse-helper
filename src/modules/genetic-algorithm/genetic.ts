import {Cell} from '@/storages/types';
import {Feature, Point} from 'geojson';
import {getPermutations} from './permutations';
import {getDistanceMatrix} from './distance-matrix';
import {getRandomIndex} from './random-index';
import {getDistance} from '@/modules/common';

async function loadGenetic<TEntity, TUserData>() {
  const Genetic = await import('genetic-js');
  const genetic = Genetic.create<TEntity, TUserData>();
  genetic.optimize = Genetic.Optimize.Minimize;
  genetic.select1 = Genetic.Select1.Tournament2;
  genetic.select2 = Genetic.Select2.FittestRandom;

  return genetic;
}

export type Solution = {
  route: Cell[];
  distance: number;
  stats: {
    maximum: number;
    minimum: number;
    mean: number;
    stdev: number;
  };
};

export function solveOptimizationRoute(
  cells: Cell[],
  startPoint: Feature<Point>,
  endPoint: Feature<Point>
): Promise<Solution> {
  const distanceMatrix = getDistanceMatrix(cells);
  const permutations = getPermutations(cells);

  const geneticUserData = {
    distanceMatrix,
    permutations,
    getRandomIndex,
    getDistance,
    startPoint,
    endPoint,
  };

  return loadGenetic<Cell[], typeof geneticUserData>().then(genetic => {
    genetic.seed = function () {
      const permutations = this.userData.permutations;
      const randomIndex = Math.floor(Math.random() * permutations.length);
      return permutations[randomIndex];
    };

    genetic.fitness = function (entity: Cell[]) {
      const distanceMatrix = this.userData.distanceMatrix;
      let dist = 0;

      for (let i = 0; i < entity.length; i++) {
        if (!entity[i - 1]) {
          dist += this.userData.getDistance(
            this.userData.startPoint.geometry,
            entity[i].loadingPoint.geometry
          );
          continue;
        }
        const currCellId = entity[i].id;
        const prevCellId = entity[i - 1].id;

        dist += distanceMatrix[`${currCellId}-${prevCellId}`];
      }

      dist += this.userData.getDistance(
        entity[entity.length - 1].loadingPoint.geometry,
        this.userData.endPoint.geometry
      );

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
        const [first, second] = reverse
          ? [parent2, parent1]
          : [parent1, parent2];
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

    return new Promise(resolve => {
      genetic.notification = function (pop, gen, stats, isFinished) {
        if (isFinished) {
          resolve({route: pop[0].entity, distance: pop[0].fitness, stats});
        }
      };

      genetic.evolve({size: permutations.length}, geneticUserData);
    });
  });
}
