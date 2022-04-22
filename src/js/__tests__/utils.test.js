/**
 * Тесты для задачи №4. Отрисовка границ поля
 */

import { calcTileType, calcHealthLevel } from '../modules/utils';

test.each([
  [0, 'top-left'],
  [3, 'top'],
  [5, 'top'],
  [7, 'top-right'],
  [8, 'left'],
  [16, 'left'],
  [17, 'center'],
  [28, 'center'],
  [31, 'right'],
  [56, 'bottom-left'],
  [59, 'bottom'],
  [63, 'bottom-right'],
])('test calcTileType', (received, expected) => {
  expect(calcTileType(received, 8)).toEqual(expected);
});

test.each([
  [10, 'critical'],
  [40, 'normal'],
  [60, 'high'],
])('test calcHealthLevel', (received, expected) => {
  expect(calcHealthLevel(received)).toEqual(expected);
});
