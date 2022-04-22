// Задача 10. Визуальный отклик
// функция для генерации доступных чеек
export default function availableCells(index, radius, action = 'move') {
  const boardSize = 8; // размер поля
  const midCol = index % boardSize; // находим столбец выделенной ячейки
  const arrCells = []; // массив для доступных ячеек

  // крайний левый столбец
  let leftCol = midCol - radius;
  if (leftCol < 0) { leftCol = 0; }

  // крайний правый столбец
  let rightCol = midCol + radius;
  if (rightCol > boardSize) { rightCol = boardSize; }

  // минимальное значение доступной ячейки
  let min = index - radius - boardSize * radius;
  if (min < 0) { min = 0; }

  // максимальное значение доступное ячейки
  let max = index + radius + boardSize * radius;
  if (max >= boardSize ** 2) { max = boardSize ** 2; }

  // если метод используется для атаки
  if (action === 'attack') {
    // цикл от минимальноего до максимального значений, от левого столбца до правого.
    for (let i = min; i <= max; i += 1) {
      if (i % boardSize >= leftCol && i % boardSize <= rightCol && i !== index) {
        arrCells.push(i); // пушим массив по нужному условию.
      }
    }
  }

  // если метод используется для передвижения
  if (action === 'move') {
    /**
     * Стрелочная функция, проверяет соответствует ли ячейка условия,
     * если соответствует, то добавляет её в массив
     * @param cell проверяемая ячейка
     * @param leftMinCol левый столбец
     * @param rightMaxCol правый столбец
     * @param minValues минимальное значение
     * @param maxValues максимальное значение
     */
    const condition = (cell, leftMinCol, rightMaxCol, minValues, maxValues) => {
      const leftBorder = cell % boardSize >= leftMinCol;
      const rightBorder = cell % boardSize <= rightMaxCol;
      const topBotBorder = cell >= minValues && cell <= maxValues;
      if (leftBorder && rightBorder && topBotBorder) { arrCells.push(cell); }
    };

    // цикл для добавления ходов
    for (let i = 1; i <= radius; i += 1) {
      const midRightTop = index - boardSize * i + i; // диагональ c центра на право вверх
      condition(midRightTop, midCol, rightCol, min, index);

      const midRightBot = index + boardSize * i + i; // диагональ c центра на право вниз
      condition(midRightBot, midCol, rightCol, index, max);

      const midLeftTop = index - boardSize * i - i; // диагональ c центра на лево вверх
      condition(midLeftTop, leftCol, midCol, min, index);

      const midLeftBot = index + boardSize * i - i; // диагональ c центра на лево вниз
      condition(midLeftBot, leftCol, midCol, index, max);

      const midTop = index - boardSize * i; // вертикаль c центра вверх
      condition(midTop, midCol, midCol, min, index);

      const midBot = index + boardSize * i; // вертикаль c центра вниз
      condition(midBot, midCol, midCol, index, max);

      const midLeft = index - i; // горизонталь c центра влево
      condition(midLeft, leftCol, midCol, min, index);

      const midRight = index + i; // горизонталь c центра влево
      condition(midRight, midCol, rightCol, index, max);
    }
  }

  return arrCells; // возвращаем массив с допустимыми ячейками.
}
