/**
 * Тесты для задачи № 6. Запрет создания объектов Character
 * А так же его прилагающиеся методы и подклассы
 */

import Character from '../heroes/Character';
import CharacterLoader from '../heroes/CharacterLoader';
import Bowman from '../heroes/Bowman';
import Daemon from '../heroes/Daemon';
import Magician from '../heroes/Magician';
import Swordsman from '../heroes/Swordsman';
import Undead from '../heroes/Undead';
import Vampire from '../heroes/Vampire';

// тест на создание класса напрямую через new Character()
test('error new Character', () => {
  const expected = 'Запрещено использовать new Character()';
  function received() { return new Character(1); }

  expect(received).toThrow(expected);
});

// создание класса из объекта (служит для преобразования в класс из JSON)
test('CharacterLoader', () => {
  const expected = {
    level: 2,
    type: 'vampire',
    attack: 45,
    defence: 45,
    health: 90,
    moveCell: 2,
    attackCell: 2,
  };
  const received = new CharacterLoader(expected);
  expect(received).toEqual(expected);
});

test('create Bowman', () => {
  const received = new Bowman(1);
  const expected = {
    type: 'bowman',
    attack: 25,
    defence: 25,
    health: 50,
    level: 1,
    moveCell: 2,
    attackCell: 2,
  };
  expect(received).toEqual(expected);
});

test('create Daemon', () => {
  const received = new Daemon(1);
  const expected = {
    type: 'daemon',
    attack: 10,
    defence: 40,
    health: 50,
    level: 1,
    moveCell: 1,
    attackCell: 4,
  };
  expect(received).toEqual(expected);
});

test('create Magician', () => {
  const received = new Magician(1);
  const expected = {
    type: 'magician',
    attack: 10,
    defence: 40,
    health: 50,
    level: 1,
    moveCell: 1,
    attackCell: 4,
  };
  expect(received).toEqual(expected);
});

test('create Swordsman', () => {
  const received = new Swordsman(1);
  const expected = {
    type: 'swordsman',
    attack: 40,
    defence: 10,
    health: 50,
    level: 1,
    moveCell: 4,
    attackCell: 1,
  };
  expect(received).toEqual(expected);
});

test('create Undead', () => {
  const received = new Undead(1);
  const expected = {
    type: 'undead',
    attack: 40,
    defence: 10,
    health: 50,
    level: 1,
    moveCell: 4,
    attackCell: 1,
  };
  expect(received).toEqual(expected);
});

test('create Vampire', () => {
  const received = new Vampire(1);
  const expected = {
    type: 'vampire',
    attack: 25,
    defence: 25,
    health: 50,
    level: 1,
    moveCell: 2,
    attackCell: 2,
  };
  expect(received).toEqual(expected);
});

test('create Vampire, Character metod levelUp', () => {
  const received = new Vampire(1);
  const expected = {
    type: 'vampire',
    attack: 32, // + 30%
    defence: 32, // + 30%
    health: 100, // + 80, max 100
    level: 2, // +1
    moveCell: 2,
    attackCell: 2,
  };

  received.levelUp();

  expect(received).toEqual(expected);
});

test('create Vampire, Character metod levelUp, health < 20', () => {
  const received = new Vampire(1);
  const expected = {
    type: 'vampire',
    attack: 25, // не повышается из за низкого здоровья
    defence: 25, // не повышается из за низкого здоровья
    health: 90, // + 80, max 100
    level: 2, // +1
    moveCell: 2,
    attackCell: 2,
  };

  received.health = 10;
  received.levelUp();

  expect(received).toEqual(expected);
});

test('create Vampire, Character metod levelUp to error, health = 0', () => {
  const expected = 'Нельзя повысить левел умершего';
  const hero = new Vampire(1);

  hero.health = 0;

  function received() { return hero.levelUp(); }

  expect(received).toThrow(expected);
});

test('create Vampire level 2, Character metod levelUpper auto to 2 level', () => {
  const received = new Vampire(2);
  const expected = {
    type: 'vampire',
    attack: 32,
    defence: 32,
    health: 100,
    level: 2,
    moveCell: 2,
    attackCell: 2,
  };
  expect(received).toEqual(expected);
});

// создание героя Vampire 10го уровня, создаётся 4-й уровень из за лимита в levelUp()
test('create Vampire level 10 => 4, Character metod levelUpper, max level = 4', () => {
  const received = new Vampire(10);
  const expected = {
    type: 'vampire',
    attack: Math.floor((Math.floor(Math.floor(25 * 1.3) * 1.8)) * 1.8), // 25 => 102 = max 4 lvl
    defence: Math.floor((Math.floor(Math.floor(25 * 1.3) * 1.8)) * 1.8), // 25 => 102 = max 4 lvl
    health: 100, // 50 => 100 max
    level: 4, // 5 => 4
    moveCell: 2,
    attackCell: 2,
  };
  expect(received).toEqual(expected);
});

test('create Vampire, Character metod damage, health', () => {
  const received = new Vampire(1);
  const expected = {
    type: 'vampire',
    attack: 25,
    defence: 25,
    health: 35, // 50 - (40 -25) = 35
    level: 1,
    moveCell: 2,
    attackCell: 2,
  };

  received.damage(40);

  expect(received).toEqual(expected);
});

test('create Vampire, Character metod damage to return', () => {
  const heroOne = new Vampire(1);
  const heroTwo = new Vampire(1);
  heroTwo.health = -10;

  expect(heroOne.damage(40)).toEqual(15);
  expect(heroTwo.damage(40)).toEqual(0);
});
