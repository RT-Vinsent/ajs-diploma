import Character from '../heroes/Character';
import availableCells from './availableCells';

export default class PositionedCharacter {
  constructor(character, position) {
    if (!(character instanceof Character)) {
      throw new Error('character must be instance of Character or its children');
    }

    if (typeof position !== 'number') {
      throw new Error('position must be a number');
    }

    this.character = character;
    this.position = position;
    // this.team = '';
  }

  // Задача № 8. Вывод информации о персонаже
  // метод возвращает характеристики героя
  tooltip() {
    const {
      level,
      attack,
      defence,
      health,
    } = this.character;
    return `\u{1F396} ${level} \u{2694} ${attack} \u{1F6E1} ${defence} \u{2764} ${health}`;
  }

  // Задача №10. Визуальный отклик - Перейти на другую клетку
  moveCheck(cellIndex) {
    const { moveCell } = this.character; // радиус передвижения
    const cell = availableCells(this.position, moveCell, 'move'); // доступные ячейки
    const action = cell.includes(cellIndex); // перемещение возможно или нет

    return action; // возвращает истину, если ход возможен.
  }

  // Задача №10. Визуальный отклик - Атаковать противника
  attackChek(cellIndex) {
    const { attackCell } = this.character; // радиус атаки
    const cell = availableCells(this.position, attackCell, 'attack'); // доступные ячейки
    const action = cell.includes(cellIndex); // атака возможна или нет

    return action; // возвращает истину, если атака возможна
  }
}
