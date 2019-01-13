define(['./domHelpers'], (DOMHelpers) => {
  return class GridHelpers {
    constructor() {}

    static getCoords(grid) {
      let {
        top: topGrid,
        bottom: bottomGrid,
        left: leftGrid,
        right: rightGrid
      } = grid.getBoundingClientRect();
      
      return {
        topGrid,
        bottomGrid,
        leftGrid,
        rightGrid
      };
    }
  }
});