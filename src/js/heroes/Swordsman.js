import Character from './Character';

export default class Swordsman extends Character {
  constructor(lvl) {
    super();
    super.type = 'swordsman';
    super.attack = 40;
    super.defence = 10;
    this.moveCell = 4;
    this.attackCell = 1;
    super.levelUpper(lvl);
  }
}
