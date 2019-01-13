define(['utils/domHelpers'], (dom) => {
  return class ActorModel {
    constructor(schema) {
      this.schema = schema;
      this.items = schema.model.map(item => item.map(row => row.split('')));
      this.modelOffsets = schema.modelOffsets;
      this.rotateIndex = 0;
    }

    updateRotateIndex(index) {
      this.rotateIndex = (index + 1) % 4;
      return this.rotateIndex;
    }
  }
});