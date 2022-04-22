import Character from './Character';

export default class Daemon extends Character {
  constructor(lvl) {
    super();
    super.type = 'daemon';
    super.attack = 10;
    super.defence = 40;
    this.moveCell = 1;
    this.attackCell = 4;
    super.levelUpper(lvl);
  }
}
