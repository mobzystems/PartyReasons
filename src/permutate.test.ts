import permutate from "./permutate";

it('1 element', () => {
    expect(permutate([6], (a) => true)).toEqual(1);
});

it('2 elements', () => {
    let result: number[][] = [];
    expect(permutate([6, 3], (a) => { result.push(a.slice(0)); return true })).toEqual(2);
    expect(result[0]).toEqual([6, 3]);
    expect(result[1]).toEqual([3, 6]);
});
