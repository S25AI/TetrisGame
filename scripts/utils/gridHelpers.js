define(['./domHelpers'], (DOMHelpers) => {
  return class GridHelpers {
    constructor() {}

    static getCoords(grid) {
      let {left} = grid.getBoundingClientRect();

      //fix problem with browser self pixel
      if (left !== Math.floor(left)) {
        let grid = document.querySelector('.grid');
        grid.style.position = 'relative';
        grid.style.left = '0.5px';
      }

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