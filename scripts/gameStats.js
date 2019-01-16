define([], () => {
  return class Game {
    constructor() {
      this.counter = 0;
      this.gameLevel = 1;
      this.gameSpeed = 1;
      this.countWeight = 10;
    }

    updateCounter(count) {
      this.counter += count * this.countWeight;
    }

    resetCounter() {
      this.counter = 0;
    }

    get score() {
      return this.counter;
    }
  }
})