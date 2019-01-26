let hash = require('crypto-js').SHA256;

const DIFFICULTY = 6;

class Block {
  constructor(prevBlock, data) {
    this.prevHash = prevBlock.hash;
    this.data = data;
    this.height = prevBlock.height + 1;
    this.nonce = 0;
  }

  get hash() {
    return hash(JSON.stringify(this)).toString();
  }

  get validHash() {
    return this.hash.startsWith('0'.repeat(DIFFICULTY));
  }
}

const genesis = new Block({ hash: '', height: -1 }, 'Once upon a time,');

module.exports = { Block, genesis };
