import {test, expect} from 'vitest';
import {getRandomIndex} from './random-index';

test('getRandomIndex should return validate index', () => {
  const ARR = [1, 2, 3, 4, 5];
  const randomIndex = getRandomIndex(ARR);
  expect(randomIndex).toBeGreaterThanOrEqual(0);
  expect(randomIndex).toBeLessThan(ARR.length);
});
