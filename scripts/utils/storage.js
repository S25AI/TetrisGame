define(() => {
  return class Storage {
    static getItem(key = 'score') {
      return localStorage.getItem(key) || 0;
    }

    static setItem({key = 'score', value}) {
      let oldValue = localStorage.getItem(key) || 0;
      if (oldValue < value) localStorage.setItem(key, value);
    }

    static removeItem(key) {
      localStorage.removeItem(key);
    }
  }
})