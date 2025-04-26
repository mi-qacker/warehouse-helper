/**
 * Generates all possible permutations of elements in an array
 * @param arr Input array of type T
 * @returns Array of all possible permutations
 */
export function getPermutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr];

  const result: T[][] = [];
  const heapPermutation = (array: T[], size: number) => {
    if (size === 1) {
      result.push([...array]);
      return;
    }

    for (let i = 0; i < size; i++) {
      heapPermutation(array, size - 1);

      if (size % 2 === 1) {
        [array[0], array[size - 1]] = [array[size - 1], array[0]];
      } else {
        [array[i], array[size - 1]] = [array[size - 1], array[i]];
      }
    }
  };

  heapPermutation([...arr], arr.length);
  return result;
}
