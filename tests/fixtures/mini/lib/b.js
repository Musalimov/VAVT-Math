import { twice } from './a.js';
const helper = (x) => x * 100;
export const B = helper(twice(1));
export const money = '$& $1 $$'; // «$» в коде не должен ломать сборку
