define(['utils/domHelpers', 'utils/gridHelpers', 'constants/index'], (dom, GridHelpers, {GRID_SIZE}) => {
  return class Grid {
    constructor(rows, columns) {
      this.grid = dom.createGrid(rows, columns);
      this.gridModel = this.createGridModel(rows, columns);
      this.upperActorIndex = Infinity;
      this.rowsCount = rows;
      this.columnsCount = columns;
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

    checkGridRows() {
      let len = this.rowsCount - this.upperActorIndex < 25 ? this.rowsCount - this.upperActorIndex : 25;
      let stack = [];

      let deletedRowsCount = 0;

      for (let i = this.upperActorIndex; i < this.upperActorIndex + len; i++) {
        for (let j = 0; j < this.columnsCount; j++) {
          if (this.gridModel[i][j] !== 1) {
            stack.push(this.gridModel[i]);
            break;
          }
        }
      }

      for (let i = this.upperActorIndex + len - 1; i >= this.upperActorIndex; i--) {
        if (stack.length) {
          this.gridModel[i] = stack.pop();
        } else {
          this.gridModel[i] = new Array(this.columnsCount).fill(0);
          deletedRowsCount += 1;
        }
      }

      return deletedRowsCount;
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
        return {gameOver: true};
      }

      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          if (this.gridModel[row + i]) {
            if (Number(modelSchema[i][j] === '0')) {
              this.gridModel[row + i][col + j] = Number(modelSchema[i][j] === '0');
            }

            if (this.gridModel[row + i][col + j] == 1 && row + i < this.upperActorIndex) {
              this.upperActorIndex = row + i;
            }
          }
        }
      }

      return {score: this.checkGridRows()}; 
    }
  }
})