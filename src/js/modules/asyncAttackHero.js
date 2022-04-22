/* eslint-disable no-param-reassign */
import cursors from './cursors';

export default async function asyncAttackHero(attackedHero, protectingHero, gameState, gamePlay) {
  const { attack } = attackedHero.character; // атака героя атакующего
  const damage = protectingHero.character.damage(attack); // наносим урон защищающему
  const { health } = protectingHero.character; // проверяем здоровье защищающего
  const { character, position, team } = protectingHero; // позиция и команда защищающего
  let heroIndex; // индекс защищающего героя в своей команде

  // Задача №14. Game Loop - удаление героя
  // если герой человека умер, то удаляем его
  if (team === 'player' && health <= 0) {
    heroIndex = gameState.positionPlayer.indexOf(protectingHero);
    if (heroIndex !== -1) {
      gameState.positionPlayer.splice(heroIndex, 1);
      gameState.teamPlayer.del(character);
      gamePlay.deselectCell(position);
      gamePlay.deselectCell(attackedHero.position);
      gamePlay.setCursor(cursors.notallowed); // переключаем курсор на недоступно для атаки
    }
    if (position === gameState.select) {
      gameState.select = false; // последний выделенный герой
    }
  }

  // Задача №14. Game Loop - удаление героя
  // если герой бота умер, то удаляем его
  if (team === 'bot' && health <= 0) {
    heroIndex = gameState.positionBot.indexOf(protectingHero);
    if (heroIndex !== -1) {
      gameState.positionBot.splice(heroIndex, 1);
      gameState.teamBot.del(character);
      gamePlay.deselectCell(position);
    }
  }

  // eslint-disable-next-line no-console
  console.log(`${attackedHero.team} атаковал с ячейки ${attackedHero.position} на ячейку ${position}`);

  // отрисовка анимации урона над защищаюим героем
  await gamePlay.showDamage(position, damage);

  // перерисовка героев на игровом поле
  gamePlay.redrawPositions(gameState.positions());
}
