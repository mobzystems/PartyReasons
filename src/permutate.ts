/*
  Permutate the elements in the specified array by swapping them
  in-place and calling the specified callback function on the array
  for each permutation.

  Return the number of permutations.

  If array is undefined, null or empty, return 0.

  NOTE: when permutation succeeds, the array should be in the original state
  on exit!
*/
export default function permutate<T>(array: T[], callback: (array: T[]) => boolean) {
    // Do the actual permutation work on array[], starting at index
    const p = (array: T[], index: number, callback: (array: T[]) => boolean) : number => {

      // Swap elements i1 and i2 in array a[]
      const swap = (a: T[], i1: number, i2: number) : void => {
        let t = a[i1];
        a[i1] = a[i2];
        a[i2] = t;
      }

      // When we're on the last index in the array, we're done:
      if (index == array.length - 1) {
        callback(array); // Do the callback
        return 1; // This is a single permutation
      } else {
        // Not on the last index - permutate the rest of the array as-is
        let count = p(array, index + 1, callback);
        // Then swap the element at index i to the front,
        // permutate again and swap back
        for (let i = index + 1; i < array.length; i++) {
          swap(array, i, index);
          count += p(array, index + 1, callback); // Increment the permutation count
          swap(array, i, index);
        }
        // Return the number of permutations we performed
        return count;
      }
    }

    // ENTRY POINT FOR permutate(). If invalid or empty array, return 0 (no permutations)
    if (!array || array.length == 0)
      return 0;
    else
      // Permutate the array and return the number of permutations
      return p(array, 0, callback);
  }