import { A, nameA } from './lib/a.js';
import * as b from './lib/b.js';
globalThis.__result = { A, nameA, B: b.B, money: b.money };
