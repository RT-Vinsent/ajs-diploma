import Team from './Team';
import themes from './themes';
import CharacterLoader from '../heroes/CharacterLoader';
import PositionedCharacter from './PositionedCharacter';

// Задача №16. Хранение состояния
export default class GameState {
  constructor() {
    // стандартное состояние игры
    this.theme = themes.prairie; // тема поля по умолчанию
    this.teamPlayer = new Team(); // команда для человека
    this.teamBot = new Team(); // команда для бота
    this.positionPlayer = []; // массив с позициями игрока
    this.positionBot = []; // массив с позициями бота
    this.turnPlayer = false; // ход игрока Истина или Ложь
    this.select = false; // выбранный герой игрока
    this.level = 1; // уровень игры.
    this.score = 0; // баллы за игру
    this.timeKiller = 4; // Ограничение на количество уровней игры
  }

  // метод задаёт стандартное состояние для новой игры
  newGame() {
    this.theme = themes.prairie; // тема поля по умолчанию
    this.teamPlayer = new Team(); // создаём пустую команду для человека
    this.teamBot = new Team(); // создаём пустую команду для бота
    this.positionPlayer = []; // массив с позициями игрока
    this.positionBot = []; // массив с позициями бота
    this.level = 1; // уровень игры.
  }

  // Задача №16. Хранение состояния - load
  // метод служит для загрузки состояния игры
  loadGame(object) {
    if (object === null) { return; }
    this.theme = object.theme; // тема поля
    this.teamPlayer = new Team(); // создаём пустую команду для человека
    this.teamBot = new Team(); // создаём пустую команду для бота
    this.select = object.select; // выбранный герой игрока
    this.parseHero(object.positionPlayer, 'player'); // позиции игрока
    this.parseHero(object.positionBot, 'bot'); // массив с позициями бота
    this.turnPlayer = object.turnPlayer; // ход игрока Истина или Ложь
    this.level = object.level; // уровень игры.
    this.score = object.score; // баллы за игру
    this.timeKiller = object.timeKiller; // Ограничение на количество уровней игры
  }

  // метод парсит позиции героев преобразовывая объекты в класс
  parseHero(object, gamer) {
    const positionHeroes = []; // массив с позиций с героями
    const teamHeroes = []; // массив героев

    // цикл, создаёт классы героев из объектов,
    for (let i = 0; i < object.length; i += 1) {
      const { position, character, team } = object[i];
      const characterClass = new CharacterLoader(character); // герой
      const positionHero = new PositionedCharacter(characterClass, position, team); // hero позиция

      positionHeroes.push(positionHero); // сохраняем героя с позицией в массик
      teamHeroes.push(positionHero.character); // сохраняем героя в массив
    }

    // если метод вызван для человека, то присваиваем значения ему
    if (gamer === 'player') {
      this.teamPlayer.addAll(...teamHeroes);
      this.positionPlayer = positionHeroes;
    }

    // если метод вызван для бота, то присваиваем значения ему
    if (gamer === 'bot') {
      this.teamBot.addAll(...teamHeroes);
      this.positionBot = positionHeroes;
    }
  }

  // метод объединяет позиции команд (используется для отрисовке на экране)
  positions() { return [...this.positionPlayer, ...this.positionBot]; }

  // ситаем заработанный очки
  scores() {
    let score = 0;
    for (const character of this.teamPlayer.heroes) {
      score += character.health;
    }
    // eslint-disable-next-line no-console
    console.log(`Заработал за игру ${score} очков, всего ${this.score} очков`);
    this.score += score;
    return score;
  }

  static from(object) {
    // TODO: create object
    if (typeof object === 'object') {
      const newObject = {
        theme: object.theme, // тема поля
        positionPlayer: object.positionPlayer, // позиции игрока
        positionBot: object.positionBot, // массив с позициями бота
        turnPlayer: object.turnPlayer, // ход игрока Истина или Ложь
        select: object.select, // выбранный герой игрока
        level: object.level, // уровень игры.
        score: object.score, // баллы за игру
        timeKiller: object.timeKiller, // Ограничение на количество уровней игры
      };
      return newObject;
    }
    return null;
  }
}
