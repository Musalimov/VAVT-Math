const helper = (x) => x + 1; // то же имя, что в b.js — не должно конфликтовать
export const A = helper(1);
export function twice(x) { return 2 * x; }
const hidden = 'a';
export { hidden as nameA };
