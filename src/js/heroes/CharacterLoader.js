import Character from './Character';

// класс используется для преобразования объекта в класс после паринга
export default class CharacterLoader extends Character {
  constructor(object, level) {
    super(level);
    super.level = object.level;
    super.type = object.type;
    super.attack = object.attack;
    super.defence = object.defence;
    super.health = object.health;
    this.moveCell = object.moveCell;
    this.attackCell = object.attackCell;
  }
}
