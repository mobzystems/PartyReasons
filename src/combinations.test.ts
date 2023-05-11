import choose, { combinations } from "./combinations";

it('choose 1 of 3', () => {
    const c = choose([6, 3, 9], 1);
    expect(c.length).toEqual(3);
    expect(c[0]).toEqual([6]);
    expect(c[1]).toEqual([3]);
    expect(c[2]).toEqual([9]);
});

it('choose 2 of 3', () => {
    const c = choose([3, 6, 9], 2);
    // console.log(c);
    expect(c.length).toEqual(3);
    expect(c[0]).toEqual([3, 6]);
    expect(c[1]).toEqual([3, 9]);
    expect(c[2]).toEqual([6, 9]);
});

it('choose 3 of 3', () => {
    const c = choose([3, 6, 9], 3);
    // console.log(c);
    expect(c.length).toEqual(1);
    expect(c[0]).toEqual([3, 6, 9]);
});

it('choose 2 of 4', () => {
    const c = choose([3, 6, 8, 9], 2);
    // console.log(c);
    expect(c.length).toEqual(6);
});

// it('combinations of 3', () => {
//     const c = combinations([3, 6, 8]);
//     console.log(c);
// })