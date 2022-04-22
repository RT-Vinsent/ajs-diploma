import Character from './Character';

export default class Bowman extends Character {
  constructor(lvl) {
    super();
    super.type = 'bowman';
    super.attack = 25;
    super.defence = 25;
    this.moveCell = 2;
    this.attackCell = 2;
    super.levelUpper(lvl);
  }
}
