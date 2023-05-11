import permutate from "./permutate";

it('1 element', () => {
    // No callback
    expect(permutate([6])).toEqual(1);
    // Callback returns void
    expect(permutate([6], (a) => {})).toEqual(1);
    // Callback returns true
    expect(permutate([6], (a) => true)).toEqual(1);
});

it('2 elements', () => {
    let result: number[][] = [];
    expect(permutate([6, 3], (a) => { result.push([...a]) } )).toEqual(2);
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual([6, 3]);
    expect(result[1]).toEqual([3, 6]);
});

it('2 elements with abort', () => {
    let result: number[][] = [];
    expect(permutate([6, 3], (a) => { result.push([...a]); return false })).toEqual(1);
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual([6, 3]);
});

it('10 elements', () => {
    // No callback
    expect(permutate([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toEqual(3628800);
})
