import { rot2, rx, rz } from '../../../math/linalg.js';
export const PRE = {
  '2d': [
    ['rot90', rot2(Math.PI / 2)],
    ['rot30', rot2(Math.PI / 6)],
    ['shear', [1, 1, 0, 1]],
    ['stretch', [2, 0, 0, 0.5]],
    ['scale', [1.5, 0, 0, 1.5]],
    ['reflect', [-1, 0, 0, 1]],
    ['proj', [1, 0, 0, 0]],
    ['singular', [1, 2, 0.5, 1]],
    ['eig', [3, 1, 0, 2]],
    ['spiral', [1, -1, 1, 1]],
    ['random', null],
  ],
  '3d': [
    ['rotz', rz(Math.PI / 2)],
    ['rotx', rx(Math.PI / 4)],
    ['shear', [1, 0, 1, 0, 1, 0, 0, 0, 1]],
    ['stretch', [2, 0, 0, 0, 1, 0, 0, 0, 0.5]],
    ['reflect', [1, 0, 0, 0, 1, 0, 0, 0, -1]],
    ['proj3', [1, 0, 0, 0, 1, 0, 0, 0, 0]],
    ['rank1', [1, 1, 0, 0.5, 0.5, 0, 1, 1, 0]],
    ['eig', [2, 0, 0, 1, 3, 0, 0, 0, 0.5]],
    ['random', null],
  ],
};
