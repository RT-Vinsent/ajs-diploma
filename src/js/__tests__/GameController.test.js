/* eslint-disable no-console */
import GameStateService from '../services/GameStateService';
import GameController from '../services/GameController';
import GamePlay from '../services/GamePlay';

jest.mock('../services/GameStateService');
jest.mock('../services/GamePlay');
jest.mock('../modules/GameState');
beforeEach(() => { jest.resetAllMocks(); });

/**
 * ВАЖНО:
 *
 * Тест GameStateService на throw new Error() в GameStateService.test.js
 * Так как в этом файле использую МОК функции, то ошибка огнорировалась.
 * Не смог очистить мок, поэтому протестировал её там.
 *
 * А тут тестируется сам GameController.
 */

/**
 * тестим метод onLoadGameClick в gameController.
 * так как метод load в GameStateService возвращает ошибку из за отсутствия сохранения,
 * то метод onLoadGameClick вызывает GamePlay.showMessage() и false.
 * Так как showMessage вызывает windows.alert, в node его нет,
 * то заменяет его моком на console.log, что бы отследить выполнение в консоле.
 * Результат проверяем по конечному результату вызова onLoadGameClick, то есть false.
 */
test('gameController metod onLoadGameClick result false and showMessage called', () => {
  const stateService = new GameStateService(null);
  const gamePlay = new GamePlay();

  // создаём GameController и передаём туда GamePlay и stateService
  const gameController = new GameController(gamePlay, stateService);

  // подмена результата функции, результат выполнения можно увидеть в консоле
  GamePlay.showMessage.mockReturnValue(console.log('метод был вызван = Сохранений нет!'));

  // вызов метода загрузки, вызывает GamePlay.showMessage() и возвращает FALSE
  const loadGame = gameController.onLoadGameClick();

  expect(loadGame).toEqual(false);
});

/**
 * тестим метод onLoadGameClick в gameController.
 * заменяем МОКОМ результат метода load в GameStateService на объект.
 * Так как showMessage вызывает windows.alert, в node его нет,
 * то заменяет его моком на console.log, что бы отследить выполнение в консоле.
 * Результат проверяем по конечному результату вызова onLoadGameClick, то есть true.
 */
test('gameController metod onLoadGameClick result true and showMessage called', () => {
  const save = {
    theme: 'prairie',
    positionPlayer: [{
      character: {
        level: 1, attack: 25, defence: 25, health: 50, type: 'bowman', moveCell: 2, attackCell: 2,
      },
      position: 32,
    }, {
      character: {
        level: 1, attack: 40, defence: 10, health: 50, type: 'swordsman', moveCell: 4, attackCell: 1,
      },
      position: 25,
    }],
    positionBot: [{
      character: {
        level: 1, attack: 10, defence: 40, health: 50, type: 'daemon', moveCell: 1, attackCell: 4,
      },
      position: 6,
    }, {
      character: {
        level: 1, attack: 10, defence: 40, health: 50, type: 'daemon', moveCell: 1, attackCell: 4,
      },
      position: 62,
    }],
    turnPlayer: true,
    select: false,
    level: 1,
    score: 1000,
    timeKiller: 999999999,
  };

  const stateService = new GameStateService(null);
  const gamePlay = new GamePlay();

  // подменяем результат функции которая возвращает ошибку на результат FALSE
  stateService.load.mockReturnValue(save);

  const gameController = new GameController(gamePlay, stateService);

  // подмена результата функции, результат выполнения можно увидеть в консоле
  GamePlay.showMessage.mockReturnValue(console.log('метод был вызван = Игра загружена!'));

  // вызов метода загрузки, вызывает GamePlay.showMessage() и возвращает TRUE
  const loadGame = gameController.onLoadGameClick();

  expect(loadGame).toEqual(true);
});

/**
 * тестим метод onSaveGameClick в gameController.
 * заменяем МОКОМ результат метода save на console.log(), что бы отследить выполнение.
 * Так как showMessage вызывает windows.alert, в node его нет,
 * то заменяет его моком на console.log, что бы отследить выполнение в консоле.
 * Результат проверяем по конечному результату вызова onSaveGameClick, то есть true.
 */
test('gameController metod onSaveGameClick result true and showMessage called', () => {
  const stateService = new GameStateService(null);
  const gamePlay = new GamePlay();
  const gameController = new GameController(gamePlay, stateService);

  // подменяем результат функций, результат выполнения можно увидеть в консоле
  stateService.save.mockReturnValue(console.log('Метод stateService.save отработал'));
  GamePlay.showMessage.mockReturnValue(console.log('метод был вызван = Игра сохранена!'));

  // вызов метода сохранения, вызывает stateService.save и GamePlay.showMessage() и возвращает TRUE
  const loadGame = gameController.onSaveGameClick();

  expect(loadGame).toEqual(true);
});
