/* eslint-disable no-param-reassign */
import availableCells from './availableCells';
import asyncAttackHero from './asyncAttackHero';

/**
 * Задача №13. Ответные действия компьютера
 * С учётом стандартных настроек, это 33,3% передвижения и 66,7% на атаку
 */
export default class BeastlyBotAI {
  constructor() {
    this.actionArr = ['attack', 'move', 'attack']; // массив с действиями
  }

  /**
   * Метод выбирает рандомно действие, атака или передвижение.
   * Если атака не возможна, то вызывается передвижение.
   * Если передвижение не возможно, то вызывается атака.
   * Если ничего не возможно, то возвращается ЛОЖЬ.
   * Если у бота нет героев, то возвращается ЛОЖЬ.
   *
   * @param gameState передаём состояние игры, для его изменения
   * @param gamePlay передаёт gamePlay для работы с визуальной составляющей
   * @returns возвращается истина или ложь, хотя зачем не придумал))
   */
  botAi(gameState, gamePlay) {
    if (!gameState.positionBot.length) { return false; }

    // рандом индекса массива с действиями
    const randInd = Math.floor(1 + Math.random() * this.actionArr.length - 1);

    // рандомное действие
    const action = this.actionArr[randInd];

    // если выпало движение, то бот двигает, если атака, то атакует
    if (action === 'move') { return BeastlyBotAI.botAiMove(gameState, gamePlay); }
    if (action === 'attack') { return BeastlyBotAI.botAiAttack(gameState, gamePlay); }

    return true;
  }

  /**
   * Метод передвижения для героев бота
   * @param  gameState передаём состояние игры для изменения
   * @param  gamePlay передаём gamePlay для отрисовки карты
   * @returns вовращаем истину или ложь
   */
  static botAiMove(gameState, gamePlay) {
    let status = false; // статус выполнения метода

    const cellsHeroes = []; // массив с занятыми ячейками
    const cellsBot = []; // массив с ячейками героев бота которые могут ходить

    for (const item of gameState.positionPlayer) {
      cellsHeroes.push(item.position); // пушим массив занятых ячеек
    }

    for (const item of gameState.positionBot) {
      cellsHeroes.push(item.position); // пушим массив занятых ячеек
      cellsBot.push(item.position); // пушим массив с ячейкаи бота для хода
    }

    /**
     * moving зацикливается до тех по пока не проверит все варианты хода
     * при выполнении передвижения возвращает истину, а иначе ложь
     */
    const moving = () => {
      // если нет героев для хода, то возвращаем ложь
      if (!cellsBot.length) { return false; }

      const cellsMove = []; // массив с ячейками для хода

      /**
       * рандомим индекс(randInd) героя,
       * по индексу ищем ячейку с позицией бота.
       * По ячейке находим героя и присваиваем его в randBot
       */
      const randInd = Math.floor(1 + Math.random() * cellsBot.length - 1);
      const randPos = cellsBot[randInd];
      const randBot = gameState.positionBot.find((elem) => elem.position === randPos);

      // массив ячеек доступных для хода по механике
      const cells = availableCells(randBot.position, randBot.character.moveCell, 'move');

      // заполняем массив cellsMove ячейками для хода, исключая занятые ячейки героями
      for (let i = 0; i < cells.length; i += 1) {
        const busy = cellsHeroes.indexOf(cells[i]);
        if (busy === -1) { cellsMove.push(cells[i]); }
      }

      /**
       * Если у этого героя нет хода, то убираем его из массива cellsBot.
       * Перезапускаем функцию moving
       */
      if (!cellsMove.length) {
        cellsBot.splice(cellsBot.indexOf(randInd), 1);
        return moving();
      }

      // если у героя есть ход, то он ходит
      if (cellsMove.length) {
        // рандомный индекс ячейки для хода из доступных
        const moveCell = Math.floor(1 + Math.random() * cellsMove.length - 1);

        // eslint-disable-next-line no-console
        console.log(`bot ходит с ячейки ${randBot.position} на ячейку ${cellsMove[moveCell]}`);

        gamePlay.deselectCell(randBot.position); // навсякий случай снимаем выделение
        randBot.position = cellsMove[moveCell]; // меняем местоположеие героя
        gamePlay.redrawPositions(gameState.positions()); // перерисовываем поле
        gameState.turnPlayer = true; // передаём ход челвоеку
      }

      return true;
    };

    status = moving(); // Выполняем подметод движения, возвращает ЛОЖЬ или ИСТИНУ

    // Если ходов для движения нет, вызывается атака
    if (!status) { status = BeastlyBotAI.botAiAttack(gameState, gamePlay); }

    return status; // возвращаем выполнено действие или нет
  }

  // атака
  static botAiAttack(gameState, gamePlay) {
    const attackBot = []; // массив парами для атаки герой БОТА + герой ЧЕЛОВЕКА
    let status = false; // типо статус выполнения метода

    /**
     * если есть герои которые могут атаковать,
     * то записываем все варианты атаки каждого героя бота в массив
     */
    for (const itemOne of gameState.positionBot) {
      // ячейки героя бота для атаки
      const cells = availableCells(itemOne.position, itemOne.character.moveCell, 'attack');

      // если в этих ячейках есть жертва, то пушим пару бот+жертва в массив
      for (const itemTwo of gameState.positionPlayer) {
        if (cells.includes(itemTwo.position)) {
          attackBot.push([itemOne, itemTwo]);
        }
      }
    }

    /**
     * Каждый из героев бота может иметь по несколько вариантов атаки.
     * Если в массиве есть варианты атаки, то бот выбирает рандомный вариант атаки.
     */
    if (attackBot.length > 0) {
      // рандомим индекс пары дял атаки
      const randInd = Math.floor(1 + Math.random() * attackBot.length - 1);

      // рандомная пара Герой бота и Человека
      const randBot = attackBot[randInd];

      // асинхронная атака по герою
      asyncAttackHero(randBot[0], randBot[1], gameState, gamePlay);

      gameState.turnPlayer = true; // передаём ход челвоеку
      status = true; // возвращаем успех атаки
    }

    // если нет возможности для атаки, то вызываем метод для перемещения
    if (!status) { status = BeastlyBotAI.botAiMove(gameState, gamePlay); }

    return status; // возвращается статус Истина или Ложь
  }
}
