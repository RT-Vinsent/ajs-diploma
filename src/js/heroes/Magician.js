import Character from './Character';

export default class Magician extends Character {
  constructor(lvl) {
    super();
    super.type = 'magician';
    super.attack = 10;
    super.defence = 40;
    this.moveCell = 1;
    this.attackCell = 4;
    super.levelUpper(lvl);
  }
}
