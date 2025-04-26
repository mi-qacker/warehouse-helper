import {test, expect} from 'vitest';
import {getPermutations} from './permutations';

test('should equal length', () => {
  const ARR = [1, 2, 3, 4, 5];
  const permutations = getPermutations(ARR);
  for (let i = 0; i < permutations.length; i++) {
    expect(permutations[i].length).toBe(ARR.length);
  }
});

test('should not be duplicates', () => {
  const ARR = [1, 2, 3, 4, 5];
  const permutations = getPermutations(ARR);
  for (let i = 0; i < permutations.length; i++) {
    for (let j = 0; j < permutations[i].length; j++) {
      expect(j).toBe(permutations[i].indexOf(permutations[i][j]));
    }
  }
});
