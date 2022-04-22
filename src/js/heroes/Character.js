export default class Character {
  constructor(lvl = 1, type = 'generic') {
    this.level = 1;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;

    // TODO: throw error if user use "new Character()"
    // Задача № 6. Запрет создания объектов Character
    if (new.target.name === 'Character') {
      const error = 'Запрещено использовать new Character()';
      throw error;
    }

    this.levelUpper(lvl); // корректирует уровень героя
  }

  // метод для повышения уровня героя при создании на N раз
  levelUpper(lvl) {
    if (lvl <= 1) { return; } // для 1го уровня ничего не делаем

    // циклом нужное количество раз увеличиваем уровень героя
    for (let i = 1; i < lvl; i += 1) { this.levelUp(); }
  }

  // метод повышения уровня героя до 4х, здоровье лечит всегда
  levelUp() {
    if (this.health <= 0) { throw new Error('Нельзя повысить левел умершего'); }

    // уровень повышаем только до 4х. Выше 4-го только исцеляем.
    if (this.level < 4) {
      /**
       * коэффициент для увеличения атаки и брони.
       * Если здоровь 100%, то коэффициент 1.8, увеличение на 80%
       * Если здоровье 50%, то коэффициент 1.3, увеличение на 30%
       * Если здоровье 1%, то коэффициент 1, увеличение на 0%
       */
      const ratio = 1.8 - ((100 - this.health) / 100);
      this.attack = Math.floor(Math.max(this.attack, this.attack * ratio)); // атака
      this.defence = Math.floor(Math.max(this.defence, this.defence * ratio)); // броня
      this.level += 1; // увеличиваем уровень на 1
    }

    // увеличиваем здоровье на 80, максимум до 100.
    this.health = this.health <= 20 ? this.health + 80 : 100;
  }

  // метод для получения урона от атаки
  damage(attack) {
    if (this.health >= 0) {
      const damage = Math.floor(Math.max(attack - this.defence, attack * 0.1));
      this.health -= damage;
      return damage;
    }
    return 0;
  }
}
