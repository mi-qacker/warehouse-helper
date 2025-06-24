import {Cell, Placement, Product} from '@/storages/types';
import {Feature, Point} from 'geojson';
import type {GLPK, LP} from 'glpk.js';
import {DistanceMatrix} from '@/storages/types';

let glpk: GLPK;

async function loadGLPK() {
  if (!glpk) {
    const GLPK = (await import('glpk.js')).default;
    glpk = GLPK();
  }
  return glpk;
}

export async function solveOptimizationPlacement(
  products: Product[],
  cells: Cell[],
  startPosition: Feature<Point>,
  distanceMatrix: DistanceMatrix
): Promise<Placement> {
  const glpk = await loadGLPK();
  const lp: LP = {
    name: 'ProductPlacement',
    objective: {
      direction: glpk.GLP_MIN,
      name: 'cost',
      vars: [],
    },
    subjectTo: [],
    binaries: [],
  };

  // Create variables x_ij (product i in cell j)
  products.forEach(product => {
    cells.forEach(cell => {
      const varName = `x_${product.id}_${cell.id}`;
      lp.objective.vars.push({
        name: varName,
        coef: distanceMatrix[`${startPosition.id}-${cell.loadingPoint.id}`] //! first startPosition is required!!!
          .distance,
      });
      lp.binaries?.push(varName);
    });
  });

  // Capacity constraints: sum(v_i * x_ij) <= V_j for each cell
  cells.forEach(cell => {
    const constraint: LP['subjectTo'][number] = {
      name: `capacity_${cell.id}`,
      vars: [],
      bnds: {type: glpk.GLP_UP, ub: cell.capacity, lb: 0},
    };

    products.forEach(product => {
      const varName = `x_${product.id}_${cell.id}`;
      constraint.vars.push({name: varName, coef: product.volume});
    });

    lp.subjectTo.push(constraint);
  });

  products.forEach(product => {
    const constraint: LP['subjectTo'][number] = {
      name: `repeat_${product.id}`,
      vars: [],
      bnds: {type: glpk.GLP_FX, ub: 1, lb: 1},
    };
    cells.forEach(cell => {
      const varName = `x_${product.id}_${cell.id}`;
      constraint.vars.push({name: varName, coef: 1});
    });
    lp.subjectTo.push(constraint);
  });

  // Storage conditions: x_ij = 0 if storage conditions don't match
  products.forEach(product => {
    cells.forEach(cell => {
      if (product.storageCondition !== cell.zoneCondition) {
        const varName = `x_${product.id}_${cell.id}`;
        lp.subjectTo.push({
          name: `storage_${product.id}_${cell.id}`,
          vars: [{name: varName, coef: 1}],
          bnds: {type: glpk.GLP_FX, ub: 0, lb: 0},
        });
      }
    });
  });

  // Incompatibility constraints: x_ij + x_kj <= 1 for incompatible pairs
  products.forEach(product => {
    product.incompatibleWith?.forEach(incompatibleId => {
      const incompatibleProduct = products.find(p => p.id === incompatibleId);
      if (!incompatibleProduct) return;

      cells.forEach(cell => {
        lp.subjectTo.push({
          name: `incompatible_${product.id}_${incompatibleId}_${cell.id}`,
          vars: [
            {name: `x_${product.id}_${cell.id}`, coef: 1},
            {name: `x_${incompatibleId}_${cell.id}`, coef: 1},
          ],
          bnds: {type: glpk.GLP_UP, ub: 1, lb: 0},
        });
      });
    });
  });

  // Solve the problem
  const result = await glpk.solve(lp);
  if (result.result.status !== glpk.GLP_OPT) {
    throw new Error('Failed to find optimal solution');
  }

  // Format the result
  const solution: Placement = {};
  Object.entries(result.result.vars).forEach(([varName, value]) => {
    if (!value) return;

    const [letter, productId, cellId] = varName.split('_');

    if (letter !== 'x') return;

    if (!solution[cellId]) {
      solution[cellId] = [productId];
    } else {
      solution[cellId].push(productId);
    }
  });

  return solution;
}
