define(['utils/domHelpers', 'utils/gridHelpers', 'constants/index'], (dom, GridHelpers, {GRID_SIZE}) => {
  return class Grid {
    constructor(rows, columns) {
      this.grid = dom.createGrid(rows, columns);
      this.gridModel = this.createGridModel(rows, columns);
    }

    get el() {
      return this.grid;
    }

    get model() {
      return this.gridModel;
    }

    createGridModel(rows, columns) {
      let gridArr = [];

      for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < columns; j++) {
          row.push(0);
        }
        gridArr.push(row);
      }

      return gridArr;
    }

    updateGridModel(lastActor) {
      if (!lastActor) return;

      let {topGrid, leftGrid} = GridHelpers.getCoords(this.grid);
      let {top, left} = lastActor.getCurrentCoords();

      let col = (left - leftGrid) / GRID_SIZE;
      let row = (top - topGrid) / GRID_SIZE;

      let {size} = lastActor.actorModel.schema;

      let modelSchema = lastActor.actorModel.schema.model[lastActor.actorModel.rotateIndex];

      if (row === 0) {
        return true;
      }

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (this.gridModel[row + i]) {
            this.gridModel[row + i][col + j] = Number(modelSchema[i][j] === '0');
          }
        }
      }
    }
  }
})