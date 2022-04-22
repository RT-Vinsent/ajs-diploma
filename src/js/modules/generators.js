import PositionedCharacter from './PositionedCharacter';

// Задача 5. Team Generation
/**
 * Генерация рандомного героя.
 *
 * @param allowedTypes итерация классов (массив Классов без new)
 * @param maxLevel максимальный уровень персонажа
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // рандомный индекс героя из массива
  const typeId = Math.floor(Math.random() * allowedTypes.length);

  // рандомный уровень героя до максимального
  const level = Math.floor(1 + Math.random() * maxLevel);

  // создаётся герой используя рандомный индекс и задаётся лвл
  const character = new allowedTypes[typeId](level);

  yield character; // возвращается готовый герой.
}

/**
 * Задача 5. Team Generation - генерация героев в команду
 *
 * @param team созданный класс команды, в которой есть свои методы
 * @param allowedTypes итерация классов (массив Классов без new)
 * @param maxLevel максимальный лвл для игроков от 1 до maxLevel
 * @param characterCount количество создаваемых героев
 */
export function generateTeam(team, allowedTypes, maxLevel, characterCount) {
  // циклом генерируем героев и добавляем в команду
  for (let i = 0; i < characterCount; i += 1) {
    // если достигнут лимит, то ретурн
    if (team.limit()) { return; }

    // добавляем героя в команду
    team.add(characterGenerator(allowedTypes, maxLevel).next().value);
  }
}

/**
 * Задача № 5. Team Generation
 * функция для генерации рандомных ячеек
 * Для позиций в начале раунда
 *
 * @param characterCount сколько ячеек нужно сгенерировать
 * @param gamer для какой команды генерировать, левой или правой
 * @returns возвращает массив с ячейками для позиций
 */
export function generatePosition(characterCount, gamer = 'player') {
  const boardSize = 8; // размер поля
  const positionCell = []; // доступно всего ячеек для команды.
  const positionTeam = []; // выданные ячейки позиций для команды.
  let column = 0; // столбец для вычисления ячеек человека.

  // если, вычисляем ячейки для бота, то столбец для вычисления меняется.
  if (gamer === 'bot') { column = boardSize - 2; }

  // цикл для вычисления доступных ячеек для команды.
  for (let i = 0; i < boardSize ** 2; i += 1) {
    if (i % boardSize === column || i % boardSize === column + 1) {
      positionCell.push(i);
    }
  }

  // функция для вычисления рандомных ячеек для команды.
  function position() {
    // рандомный индекс массива с доступными ячейками
    const index = Math.floor(Math.random() * positionCell.length);
    // если эта ячейка ещё не добавлена, то добавляем в массив
    if (!positionTeam.includes(positionCell[index])) {
      positionTeam.push(positionCell[index]);
      return positionCell[index];
    }
    // если рандомных ячеек меньше чем надо, то функция перезапускается
    if (positionTeam.length < characterCount) { return position(); }

    return undefined;
  }

  // цикл на нужное количество раз функции для вычисления рандомных ячеек.
  for (let i = 0; i < characterCount; i += 1) { position(); }

  return positionTeam; // возвращаем архив с позициями для команды.
}

// Задача № 5. Team Generation - генератор позиций для команды
export function generateHeroPosition(team, gamer) {
  const characterCount = team.length; // количество героев
  const teamPositions = generatePosition(characterCount, gamer); // генерация ячеек
  const heroesPosition = []; // массив для позиций героев команды

  // цикл на добавления позиций героев в массив
  for (let i = 0; i < characterCount; i += 1) {
    heroesPosition.push(new PositionedCharacter(team[i], teamPositions[i]));
  }

  return heroesPosition; // возвращает массив позиций героев команды
}
