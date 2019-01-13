define(() => {
  return class DOMHelpers {
    constructor() {
      this.elt = DOMHelpers.elt;
      this.createRow = DOMHelpers.createRow;
    }

    static elt(tag, cls, text = '') {
      const el = document.createElement(tag);
      el.className = cls;
      el.innerHTML = text;
      return el;
    }

    static createRow(colulmns) {
      let rowBlock = this.elt('div', 'row-block');
      let atomBlock;

      for (let i = 0; i < colulmns; i++) {
        atomBlock = this.elt('span', 'block', '');
        rowBlock.append(atomBlock);
      }

      return rowBlock;
    }

    static createGrid(rows, columns) {
      let grid = this.elt('div', 'grid');
      let rowBlock;

      for (let i = 0; i < rows; i++) {
        rowBlock = this.createRow(columns);
        grid.append(rowBlock);
      }

      return grid;
    }
  }
})