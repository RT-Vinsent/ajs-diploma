import themes from '../modules/themes';
import { generateTeam, generateHeroPosition } from '../modules/generators';
import cursors from '../modules/cursors';
import GameState from '../modules/GameState';
import GamePlay from './GamePlay';
import Bowman from '../heroes/Bowman';
import Daemon from '../heroes/Daemon';
import Magician from '../heroes/Magician';
import Swordsman from '../heroes/Swordsman';
import Undead from '../heroes/Undead';
import Vampire from '../heroes/Vampire';
import BeastlyBotAI from '../modules/BeastlyBotAI';
import asyncAttackHero from '../modules/asyncAttackHero';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState(); // состояние игры
    this.playerHeroes = [Swordsman, Bowman, Magician]; // Доступные герои игроку
    this.botHeroes = [Daemon, Undead, Vampire]; // доступные герои компьютеру
    this.BeastlyBotAI = new BeastlyBotAI(); // искуственный интелект БОТ
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    setTimeout(() => { this.onLoadGameClick(); }, 100); // load saved stated from stateService
    this.gamePlay.drawUi(this.gameState.theme); // Задача № 3. Отрисовка поля
    this.levelNext(); // запуск уровней игры

    // инициализируем события. Задачи №8, №9 и №10
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this)); // наведение курсора
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this)); // отведение курсора
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this)); // клик по ячейке

    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this)); // Задача №15. New Game
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this)); // Задача №16. Save
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this)); // Задача №15. Load
    this.gamePlay.addUnlockGameListener(this.onUnlockGameClick.bind(this)); // Задача №18. Bonus
  }

  // Задача №18. Bonus: Time Killer
  onUnlockGameClick() {
    if (this.gameState.timeKiller === 4) {
      this.gameState.timeKiller = 1000000; // Ограничение на количество уровней игры
      GamePlay.showMessage('Снят лимит на уровни игры');
      this.gameLopp(); // проверка на окончания уровня
    } else {
      this.gameState.timeKiller = 4; // Ограничение на количество уровней игры
      GamePlay.showMessage('Установлен стандартный лимит на 4 уровня игры');
    }
  }

  // Задача №15. New Game
  onNewGameClick() {
    this.gameState.newGame(); // новая игра
    this.levelNext(); // запуск уровня игры
  }

  // Задача №16. Хранение состояния - сохраняет игру
  onSaveGameClick() {
    // this.stateService.save(GameState.from(this.gameState));
    this.stateService.save(GameState.from(this.gameState));
    GamePlay.showMessage(`Игра сохранена! Уровень: ${this.gameState.level}`);
    return true; // этот ретурн только для JEST тестов
  }

  // Задача №16. Хранение состояния - загружает игру
  onLoadGameClick() {
    const loadSave = this.stateService.load();
    if (!loadSave) {
      GamePlay.showMessage('Сохранений нет!');
      return false;
    }

    this.gameState.loadGame(loadSave); // загрузка состояния игры
    this.gamePlay.drawUi(this.gameState.theme); //  Отрисовка поля
    this.gamePlay.redrawPositions(this.gameState.positions()); // отрисовка героев

    // делаем героя активным
    const { select } = this.gameState;
    if (select !== false) { this.gamePlay.selectCell(select); }

    setTimeout(() => { GamePlay.showMessage(`Игра загружена! Уровень: ${this.gameState.level}`); }, 200);

    return true; // этот ретурн только для JEST тестов
  }

  // Задача №14. Game Loop - Запускаем некст лвл и считает очки
  gameLopp() {
    // Задача №15. Game Over
    if (!this.gameState.positionPlayer.length) {
      setTimeout(() => { GamePlay.showMessage(`Не повезло, ты проиграл. Уровень: ${this.gameState.level}`); }, 0);
    }

    // проверяет последний раунд или нет
    const gameEnd = this.gameState.level < this.gameState.timeKiller;

    // если раунд не последний, то поздравляет с победой раунда и запускает следующий
    if (!this.gameState.positionBot.length && gameEnd) {
      setTimeout(() => {
        GamePlay.showMessage(`Поздравляю! Уровень ${this.gameState.level} пройден.`);
        this.gameState.scores(); // ситаем заработанный очки
        this.gameState.level += 1; // увеличиваем уровень игры на 1
        this.levelNext(); // запуск следующего уровня игры
      }, 0);
    }

    // если раунд последний, поздравляет с окончанием игры
    if (!this.gameState.positionBot.length && !gameEnd) {
      setTimeout(() => {
        GamePlay.showMessage('Поздравляю, ты прошёл игру!');
        this.gameState.scores(); // ситаем заработанный очки
      }, 0);
    }
  }

  /**
   * Задача № 7. Отрисовка команд
   * генерирует команды, карту и позиции
   *
   * @param counPlayer количесвто добавляемых героев в команду
   * @param lvlMaxPlayer максимальный лвл команд Человека
   * @param lvlMaxBot максимальный лвл команд бота
   * @param levelUpPlayer по умолчани ложь, если истина, то увеличивает лвл
   */
  rendering(counPlayer, lvlMaxPlayer, lvlMaxBot, levelUpPlayer = false) {
    // если параметр передан, то повышаем лвл выживших героев человека
    if (levelUpPlayer === true) { // 14. Game Loop - levelUp
      for (const character of this.gameState.teamPlayer.heroes) { character.levelUp(); }
    }

    // генерируем героев команды челвоека и столько же героев для бота
    generateTeam(this.gameState.teamPlayer, this.playerHeroes, lvlMaxPlayer, counPlayer);
    const countBot = this.gameState.teamPlayer.heroes.length;
    generateTeam(this.gameState.teamBot, this.botHeroes, lvlMaxBot, countBot);

    // очищаем позиции игрока
    this.gameState.positionPlayer.length = 0;

    // генерируем позиции на карте для команд,
    this.gameState.positionPlayer.push(...generateHeroPosition(this.gameState.teamPlayer.heroes, 'player'));
    this.gameState.positionBot.push(...generateHeroPosition(this.gameState.teamBot.heroes, 'bot'));

    this.gamePlay.drawUi(this.gameState.theme); // Задача № 3. Отрисовка поля

    // отрисовываем поле с героями
    this.gamePlay.redrawPositions(this.gameState.positions());
    this.gameState.select = false; // последний выделенный герой
    this.gameState.turnPlayer = true; // передаём ход человеку
  }

  // 14. Game Loop - следующий уровень игры
  levelNext() {
    if (this.gameState.level === 1) { // Level 1: prairie
      this.gameState.theme = themes.prairie; // тема поля для Level 1: prairie
      this.rendering(2, 1, 1); // рендерим игроков и карту
    }

    if (this.gameState.level === 2) { // Level 2: desert
      this.gameState.theme = themes.desert; // тема поля для Level 2: desert
      this.rendering(1, 1, 2, true); // рендерим игроков и карту
    }

    if (this.gameState.level === 3) { // Level 3: arctic
      this.gameState.theme = themes.arctic; // тема поля для Level 3: arctic
      this.rendering(2, 2, 3, true); // рендерим игроков и карту
    }

    if (this.gameState.level === 4) { // Level 4: mountain
      this.gameState.theme = themes.mountain; // тема поля для Level 4: mountain
      this.rendering(2, 2, 3, true); // рендерим игроков и карту
    }

    // Задача №18. Bonus: Time Killer - неограниченное количество уровней
    if (this.gameState.level >= 5) {
      const themesArr = []; // массив доступных карт

      // цикл по доступным картам, забираем в массив ключи объекта
      for (const key in themes) {
        if (Object.prototype.hasOwnProperty.call(themes, key)) {
          themesArr.push(key);
        }
      }

      const themesArrId = Math.floor(Math.random() * themesArr.length); // рандомный ID ключа карты
      const themesKey = themesArr[themesArrId]; // рандомный ключ карты
      this.gameState.theme = themes[themesKey]; // тема поля с рандомным ключом

      this.rendering(2, 2, 4, true); // рендерим игроков и карту
    }
  }

  // Задача № 14. Game Loop - мы ходим, компьютер отвечает
  turnNext() { // передаём ход компьютеру
    this.gameState.turnPlayer = false; // блокируем ход человека

    // делаем искусственную задержку перед ходом
    setTimeout(() => {
      this.BeastlyBotAI.botAi(this.gameState, this.gamePlay); // ход компьютера
      this.gameLopp(); // проверка на окончания уровня
    }, 500);
  }

  // поиск героя в ячейке по индексу ячейки
  searchHero(index) {
    const player = this.gameState.positionPlayer.find((elem) => elem.position === index);
    const bot = this.gameState.positionBot.find((elem) => elem.position === index);

    // если герой есть, то возвращаем его и к какой команде он принадлежит
    if (player) { player.team = 'player'; return player; }
    if (bot) { bot.team = 'bot'; return bot; }
    return null;
  }

  // клик по ячейке
  onCellClick(index) {
    const hero = this.searchHero(index); // герой в ячейке
    const selectCell = this.gameState.select; // ячейка активного героя
    const selectHero = this.searchHero(selectCell); // выделенный герой

    // Задача № 9. Выбор персонажа
    if (hero && hero.team === 'player') { // если герой есть и это челвоек
      if (selectCell) { this.gamePlay.deselectCell(selectCell); } // снимаем выделение ячейки
      this.gamePlay.selectCell(index); // делаем выделение ячейке
      this.gameState.select = hero.position; // записываем активную ячейку героя
    }

    // если ход не человека, то на этом всё
    if (this.gameState.turnPlayer === false) { return; }

    // Задача № 11. Перемещение героя человека при клике
    if (!hero && selectHero) {
      const move = selectHero.moveCheck(index);
      if (move && this.gameState.turnPlayer) {
        this.gamePlay.deselectCell(selectCell); // снимаем выделение ячейки
        this.searchHero(selectCell).position = index; // меняем местоположение героя
        this.gameState.select = index; // новая активная ячейка
        this.gamePlay.redrawPositions(this.gameState.positions()); // перерисовываем поле
        this.gamePlay.selectCell(index); // делаем герою зелёный кружочек
        this.turnNext(); // передаём ход компьютеру
        // eslint-disable-next-line no-console
        console.log(`player ходит с ячейки ${selectCell} на ячейку ${index}`);
      }
    }

    // Задача № 12. Атака
    if (hero && selectHero && hero !== selectHero && hero.team === 'bot') {
      const attack = selectHero.attackChek(index);
      if (attack) {
        asyncAttackHero(selectHero, hero, this.gameState, this.gamePlay); // атакуем
        this.turnNext(); // передаём ход компьютеру
      }
      // Задача № 9. Выбор персонажа - выводим ошибку
      if (!attack) {
        GamePlay.showError('Это герой противника, выберите своего героя.');
      }
    }
  }

  // наведение курсора на ячейку
  onCellEnter(index) {
    const hero = this.searchHero(index); // герой в ячейке
    const selectHero = this.searchHero(this.gameState.select); // выделенный герой

    // Задача № 8. Вывод информации о персонаже
    if (hero) { // если герой есть, выводим его характеристики
      this.gamePlay.showCellTooltip(hero.tooltip(), index); // выводим сообщение характеристик;

      // переключаем курсор на выбор
      if (hero.team === 'player') { this.gamePlay.setCursor(cursors.pointer); }
      // переключаем курсор на недоступно для атаки
      if (hero.team === 'bot') { this.gamePlay.setCursor(cursors.notallowed); }
    }

    // Задача № 10. Визуальный отклик - Перейти на другую клетку (курсор)
    if (!hero && selectHero) {
      const move = selectHero.moveCheck(index);
      if (move) {
        this.gamePlay.setCursor(cursors.pointer); // переключаем курсор на выбор
        this.gamePlay.selectCell(index, 'green'); // делаем ячейку подсвечиваемой зелёным
      }
    }

    // Задача № 10. Визуальный отклик - Атаковать противника (курсор)
    if (hero && selectHero && hero !== selectHero && hero.team === 'bot') {
      const attack = selectHero.attackChek(index);
      if (attack) {
        this.gamePlay.setCursor(cursors.crosshair); // переключаем курсор на атаку
        this.gamePlay.selectCell(index, 'red'); // делаем героя врага подсвечиваемым для атаки
      }
      // Задача № 10. Визуальный отклик - Недопустимое действие (курсор)
      if (!attack) {
        this.gamePlay.setCursor(cursors.notallowed); // переключаем курсор на недоступно для атаки
      }
    }
  }

  // уведения курсора с ячейки
  onCellLeave(index) {
    const hero = this.searchHero(index); // ищем героя

    // Задача № 8. Вывод информации о персонаже - УБИРАЕМ сообщение
    this.gamePlay.hideCellTooltip(index);

    // если предыдущее наведение по ячейке был герой
    if (hero) {
      // Задача № 10. Визуальный отклик - УБИРАЕМ выделение с ячейки бота
      if (hero.position !== this.gameState.select && this.gameState.select !== false) {
        this.gamePlay.deselectCell(index);
      }
    }

    // Задача № 10. Визуальный отклик - УБИРАЕМ зелёное выделение с ячейки хода
    if (hero === null) { this.gamePlay.deselectCell(index); }

    this.gamePlay.setCursor(cursors.auto); // переключаем курсор на авто
  }
}
