/**
 * Тесты для команды, были в домашнем задании,
 * приложил их сюда и подкорректировал
 */

import Team from '../modules/Team';

const alex = {
  name: 'ALex',
  type: 'undead',
  attack: 40,
  defence: 10,
  health: 100,
  level: 1,
};

const vova = {
  name: 'Vova',
  type: 'Magician',
  attack: 10,
  defence: 40,
  health: 100,
  level: 1,
};

test('Team add', () => {
  const team = new Team();
  team.add(alex);
  team.add(alex);
  team.add(vova);

  const expected = new Set([alex, alex, vova]);

  expect(team.members).toEqual(expected);
});

test('Team addAll', () => {
  const team = new Team();
  team.addAll(alex, vova);
  team.addAll(alex, vova);
  team.addAll(alex);

  const expected = new Set([alex, vova]);

  expect(team.members).toEqual(expected);
});

test('Team addAll and toArray', () => {
  const team = new Team();
  team.addAll(alex, vova);

  const expected = [alex, vova];

  expect(team.heroes).toEqual(expected);
});

test('Team delete heroes', () => {
  const team = new Team();
  team.limitMembers = 2;
  team.addAll(alex, vova);
  team.del(alex);

  const expected = [vova];
  const received = team.heroes;

  expect(received).toEqual(expected);
});

describe('Test for generator', () => {
  const teamOne = new Team();
  teamOne.addAll(alex, vova);
  const gen = teamOne[Symbol.iterator]();

  test.each([alex, vova])('generator next', (expected) => {
    expect(gen.next().value).toEqual(expected);
  });

  test('generator loops', () => {
    const teamTwo = new Team();
    teamTwo.addAll(alex, vova);
    const expected = [alex, vova];
    const received = [];

    for (const person of teamTwo) {
      received.push(person);
    }

    expect(received).toEqual(expected);
  });
});

test('Team limit heroes false', () => {
  const team = new Team();

  const expected = false;
  const received = team.limit();

  expect(received).toBe(expected);
});

test('Team limit heroes true', () => {
  const team = new Team();
  team.limitMembers = 2;
  team.addAll(alex, vova);

  const expected = true;
  const received = team.limit();

  expect(received).toBe(expected);
});
