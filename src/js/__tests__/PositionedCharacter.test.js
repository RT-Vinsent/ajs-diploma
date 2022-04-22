/* eslint-disable indent */
/* eslint-disable no-multi-spaces */
/**
 * Тесты для задач:
 * № 8. Вывод информации о персонаже
 * № 10. Визуальный отклик
 *
 * ВАЖНО: Методы возвращают булевое значение.
 *
 * GameController вызывает эти методы по условию,
 * а дальше уже обрабатывает курсор и выделение ячейки.
 *
 * Не стал передавать состояние игры для управления в эти методы,
 * так как не хотел усложнять визуальную читаемость кода.
 */

/**
 * Параллельно на 100% тестируется функция availableCells,
 * так как PositionedCharacter её использует.
 */

import PositionedCharacter from '../modules/PositionedCharacter';
import Vampire from '../heroes/Vampire';

describe('Test for PositionedCharacter', () => {
  const character = new Vampire();
  const position = 35;
  const characterPosition = new PositionedCharacter(character, position);
  const moveCellTrue = [
    17,     19,     21,
        26, 27, 28,
    33, 34,     36, 37,
        42, 43, 44,
    49,     51,     53,
  ];
  const attackCellTrue = [
    17, 18, 19, 20, 21,
    25, 26, 27, 28, 29,
    33, 34,     36, 37,
    41, 42, 43, 44, 45,
    49, 50, 51, 52, 53,
  ];
  const moveCellFalse = [];
  const attackCellFalse = [];

  for (let i = 0; i < 64; i += 1) {
    const busyMove = moveCellTrue.indexOf(i);
    const busyAttack = attackCellTrue.indexOf(i);

    if (busyMove === -1) { moveCellFalse.push(i); }
    if (busyAttack === -1) { attackCellFalse.push(i); }
  }

  test.each([
    ['noCharacter', position, 'character must be instance of Character or its children'],
    [character, 'noPosition', 'position must be a number'],
  ])('test PositionedCharacter new Error', (hero, pos, err) => {
    expect(() => new PositionedCharacter(hero, pos)).toThrow(err);
  });

  test('metod tooltip message', () => {
    const expected = '\u{1F396} 1 \u{2694} 25 \u{1F6E1} 25 \u{2764} 50';
    const received = characterPosition.tooltip();

    expect(received).toBe(expected);
  });

  test.each(moveCellTrue)('test metod moveCheck true', (cell) => {
    const expected = true;
    const received = characterPosition.moveCheck(cell);
    expect(received).toBe(expected);
  });

  test.each(moveCellFalse)('test metod moveCheck false', (cell) => {
    const expected = false;
    const received = characterPosition.moveCheck(cell);
    expect(received).toBe(expected);
  });

  test.each(attackCellTrue)('test metod attackChek true', (cell) => {
    const expected = true;
    const received = characterPosition.attackChek(cell);
    expect(received).toEqual(expected);
  });

  test.each(attackCellFalse)('test metod attackChek false', (cell) => {
    const expected = false;
    const received = characterPosition.attackChek(cell);
    expect(received).toEqual(expected);
  });
});
