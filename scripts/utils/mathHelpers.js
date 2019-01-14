define(() => {
  return class MathHelpers {
    static getRandomInt(from, to) {
      return Math.floor(Math.random() * (to - from) + from);
    }
  }
})