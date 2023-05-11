export default function choose<T>(array: T[], n: number, startIndex?: number): T[][] {
  const index = startIndex ?? 0;
  const count = array.length - index;

  // Special case 1: Choose 1 of n: return an array of n elements
  if (n === 1)
    return array.slice(index).map(a => [a]);

  // Special case 2: Choose n of n: a single element which is the whole array
  if (count === n)
    return [array.slice(index)];

  // Combine the first element of the array with all combinations of the others of length n - 1
  const others = choose(array, n - 1, index + 1);
  const usWithOthers = others.map(o => [array[index], ...o]);

  // Get all combinations of length n from the rest of the array
  const rest = choose(array, n, index + 1);

  // Add those results together
  return [...usWithOthers, ...rest];
}

export function combinations<T>(array: T[]): T[][] {
  let results: T[][] = [];
  for (let n = 1; n <= array.length; n++) {
    results = [...results, ...choose(array, n)];
  }
  return results;
}