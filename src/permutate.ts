/*
  Permutate the elements in the specified array by swapping them
  in-place and calling the specified callback function on the array
  for each permutation.

  Return the number of permutations.

  If array is undefined, null or empty, return 0.

  NOTE: when permutation succeeds, the array should be in the original state
  on exit!
*/
export default function permutate<T>(array: T[], callback?: (array: T[]) => boolean | void) {

    // Do the actual permutation work on array[], starting at index
    // The return value is the number of permutations performed,
    // unless the callback function returned false at some point,
    // in which case the return value is negative (and also indicates the number of permurations performed)
    const p = (array: T[], index: number, callback?: (array: T[]) => boolean | void) : number => {

      // When we're on the last index in the array, we're done:
      if (index === array.length - 1) {
        // Do the callback (if specified)
        if (callback) {
          // If the callback returns false, we abort further permutation:
          if (callback(array) === false)
            return -1; 
        }
        return 1; // This is a single permutation
      }

      // Not on the last index - permutate the rest of the array as-is
      // Then swap the element at index i to the front,
      // permutate again and swap back
      let count = 0;
      for (let i = index; i < array.length; i++) {
        // Swap element i and (our) index. Dummy swap if index === but no 'if' required
        [array[i], array[index]] = [array[index], array[i]];
        // Permutate again, inspect result
        const subcount = p(array, index + 1, callback); 
        // Swap back
        [array[i], array[index]] = [array[index], array[i]];
        if (subcount < 0)
          return -(count - subcount); // Abort permutation, return a negative number
        else
          count += subcount;
      }

      // Return the number of permutations we performed
      return count;
    }

    // ENTRY POINT FOR permutate(). If invalid or empty array, return 0 (no permutations)
    if (!array || array.length === 0)
      return 0;

    // Permutate the array and return the number of permutations
      let permutations = p(array, 0, callback);
      if (permutations < 0)
        return -permutations; // Aborted at some point
      else
        return permutations;
  }