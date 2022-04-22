// Для Задачи № 5. Team Generation
export default class Team {
  // конструктор создаёт пустой Set для персонажей
  constructor() {
    this.members = new Set();
    this.limitMembers = 16;
  }

  // метод возвращает истину, если достигнут лимит героев в команде
  limit() {
    if (this.members.size === this.limitMembers) { return true; }
    return false;
  }

  // добавить персонажа в Set
  add(character) {
    this.members.add(character);
    this.toArray();
  }

  // добавить сразу несколько персонажей в Set
  addAll(...characters) {
    characters.forEach((character) => this.members.add(character));
    this.toArray();
  }

  // удалить героя из команды
  del(character) {
    this.members.delete(character);
    this.toArray();
  }

  // конвертировать Set в Array
  toArray() {
    this.heroes = [];
    this.members.forEach((character) => this.heroes.push(character));
  }

  // Символы и генераторы
  * [Symbol.iterator]() {
    this.toArray();
    for (let i = 0; i < this.heroes.length; i += 1) {
      yield this.heroes[i];
    }
  }
}
