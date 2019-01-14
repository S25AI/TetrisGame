define(
  ['utils/domHelpers', 'constants/index'],
  (dom, {GRID_SIZE}
) => {
  return class Actor {
    constructor(gridCoords, grid, actorModel) {
      this.actor = dom.elt('div', 'moving-block block__container');
      let startActorCoords = this.getStartCoords(gridCoords);

      this.grid = grid;
      this.gridCoords = gridCoords;
      this.actorModel = actorModel;
      this.rotateIndex = 0;
      this.size = actorModel.schema.size;

      this.actor.style.position = 'absolute';
      this.actor.style.top = startActorCoords.top + 'px';
      this.actor.style.left = startActorCoords.left + 'px';
      this.actor.style.width = this.actor.style.height = this.size * GRID_SIZE + 'px';

      this.handleKeyPress = this.handleKeyPress.bind(this);
      document.addEventListener('keydown', this.handleKeyPress);

      this.draw(this.rotateIndex);
    }

    draw(currentIndex) {
      this.actor.innerHTML = '';
      let newArr = this.actorModel.items[currentIndex];
      for (let i = 0; i < newArr.length; i++) {
        let row = dom.elt('div', 'block__row');
        for (let j = 0; j < newArr[i].length; j++) {
          let col = dom.elt('div', 'block__col');
          if (newArr[i][j] === '0') {
            col.classList.add('block--highlight');
          }
          row.append(col);
        }
        this.actor.append(row);
      }
    }

    get el() {
      return this.actor;
    }

    getStartCoords(gridCoords) {
      return {
        top: gridCoords.topGrid,
        left: gridCoords.leftGrid + Math.floor((gridCoords.rightGrid - gridCoords.leftGrid) / (GRID_SIZE * 2)) * GRID_SIZE
      };
    }

    getCurrentCoords() {
      return {
        top: parseInt(getComputedStyle(this.actor).top),
        left: parseInt(getComputedStyle(this.actor).left)
      };
    }

    getPosition() {
      let {leftGrid, topGrid} = this.gridCoords;

      let {left, top} = this.getCurrentCoords();

      return {
        top: (top - topGrid) / GRID_SIZE,
        left: (left - leftGrid) / GRID_SIZE
      };
    }

    clear(cb, timerId) {
      clearInterval(timerId);
      this.actor.classList.remove('moving-block');
      document.removeEventListener('keydown', this.handleKeyPress);
      let isGameOver = this.grid.updateGridModel(this);
      cb(isGameOver);
    }

    handleKeyPress(e) {
      if (e.code === 'ArrowRight') {
        this.updateActorPos({dir: 'right'});
      }
  
      if (e.code === 'ArrowLeft') {
        this.updateActorPos({dir: 'left'});
      }

      if (e.code === 'ArrowUp') {
        this.tryToRedraw();
      }
    }

    tryToRedraw() {
      let {
        left,
        top
      } = this.getPosition();

      let {
        bottomGrid,
        topGrid,
        leftGrid,
        rightGrid
      } = this.gridCoords;

      let newRotateIndex = (this.rotateIndex + 1) % 4;

      let {model} = this.grid;
      let bottomOffsetsArr = this.actorModel.modelOffsets[newRotateIndex];
      let leftOffsetsArr = this.getOffsetsArr('left', newRotateIndex);
      let rightOffsetsArr = this.getOffsetsArr('right', newRotateIndex);

      for (let i = 0; i < this.size; i++) {
        if (model[top + bottomOffsetsArr[i]] && model[top + bottomOffsetsArr[i]][left + i]) {
          return;
        }

        if (bottomOffsetsArr[i] > 5) continue;

        if (
          (top + bottomOffsetsArr[i]) * GRID_SIZE + GRID_SIZE > bottomGrid - topGrid ||
          (left + leftOffsetsArr[i]) * GRID_SIZE < 0 ||
          (left + rightOffsetsArr[i]) * GRID_SIZE >= rightGrid - leftGrid
        ) return;
      }

      this.rotateIndex = this.actorModel.updateRotateIndex(this.rotateIndex);
      this.draw(this.rotateIndex);
    }

    getOffsetsArr(type, currentIndex) {
      let method = type == 'left' ? 'indexOf' : 'lastIndexOf';
      let value = type == 'left' ? 100 : 0;

      return this.actorModel.schema.model[currentIndex]
        .map(item => item[method]('0') === -1 ? value : item[method]('0'));
    }

    isBelowObstacle() {
      let {
        left,
        top
      } = this.getPosition();

      let {model} = this.grid;
      let {bottomGrid, topGrid} = this.gridCoords;

      let offsetsArr = this.actorModel.modelOffsets[this.rotateIndex];

      for (let i = 0; i < this.size; i++) {
        if (model[top + offsetsArr[i] + 1] && model[top + offsetsArr[i] + 1][left + i]) {
          return true;
        }

        //used magic number 
        if (offsetsArr[i] > 5) continue;

        if ((top + offsetsArr[i]) * GRID_SIZE + GRID_SIZE >= bottomGrid - topGrid) {
          return true;
        }
      }
    }

    isLeftObstacle() {
      let {
        left,
        top
      } = this.getPosition();

      let {model} = this.grid;

      let offsetsArr = this.getOffsetsArr('left', this.rotateIndex);

      for (let i = 0; i < this.size; i++) {
        if (model[top + i] && model[top + i][left - 1] == 1) {
          return true;
        }

        if ((left + offsetsArr[i]) * GRID_SIZE - GRID_SIZE < 0) {
          return true;
        }
      }
    }

    isRightObstacle() {
      let {
        left,
        top
      } = this.getPosition();

      let {leftGrid, rightGrid} = this.gridCoords;

      let {model} = this.grid;

      let offsetsArr = this.getOffsetsArr('right', this.rotateIndex);

      for (let i = 0; i < this.size; i++) {
        if (model[top + i] && model[top + i][left + this.size] == 1) {
          return true;
        }

        if ((left + offsetsArr[i]) * GRID_SIZE + GRID_SIZE >= rightGrid - leftGrid) {
          return true;
        }
      }
    }

    updateActorPos({dir = 'top', cb, timerId}) {
      let {left, top} = this.getCurrentCoords();

      let newTopPosition = top, newLeftPosition = left;

      if (dir === 'top') {
        if (!this.isBelowObstacle()) {
          newTopPosition = top + GRID_SIZE;
        }
      }

      if (dir === 'left') {
        if (!this.isLeftObstacle()) {
          newLeftPosition = left - GRID_SIZE;
        }
      }

      if (dir === 'right') {
        if (!this.isRightObstacle()) {
          newLeftPosition = left + GRID_SIZE;
        }
      }

      if (dir === 'top' && left === newLeftPosition && top === newTopPosition) {
        this.clear(cb, timerId);
        return;
      }

      this.actor.style.top = newTopPosition + 'px';
      this.actor.style.left = newLeftPosition + 'px';
    }
  }
});