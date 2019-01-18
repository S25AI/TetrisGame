define([], () => {
  return class Game {
    constructor() {
      this.counter = 0;
      this.gameLevel = 1;
      this.gameSpeed = 1;
      this.countWeight = 10;
      this.breakpoint = 300;
    }

    get speed() {
      return this.gameSpeed;
    }

    get score() {
      return this.counter;
    }

    updateCounter(count) {
      this.counter += Math.pow(count, 2) * this.countWeight;
      
      if (this.counter >= this.breakpoint * this.gameLevel) {
        this.updateGameLevel();
      }
    }

    updateGameSpeed(count = 1) {
      this.gameSpeed += count;
    }

    updateGameLevel(count = 1) {
      this.gameLevel += count;
      this.updateGameSpeed();
    }

    resetCounter() {
      this.counter = 0;
    }

    get score() {
      return this.counter;
    }
  }
})