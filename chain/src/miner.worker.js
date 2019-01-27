const { Block } = require('./block');

let running = false;

self.onmessage = event => {
  if (event.data === 'terminate') {
    running = false;
  } else {
    running = true;

    block = Block.fromJSON(event.data);

    while (!block.isValid && running) {
      block.nonce = Math.random();
    }

    if (running) {
      self.postMessage(block);
    }
  }
};
