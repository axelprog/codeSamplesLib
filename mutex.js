/*

Code Sample

...
this.mutex = new Mutex(); //create on constructor
...
await this.mutex.lock(); // will lock if is free and will wait if is locked
...
mutex.release(); // release when needed

*/

class Mutex {
  constructor() {
    this.queue = [];
    this.locked = false;
  }

  lock() {
    return new Promise((resolve, reject) => {
      if (this.locked) {
        this.queue.push([resolve, reject]);
      } else {
        this.locked = true;
        resolve();
      }
    });
  }

  release() {
    if (this.queue.length > 0) {
      const [resolve, reject] = this.queue.shift();
      resolve();
    } else {
      this.locked = false;
    }
  }
}

module.exports = Mutex;
