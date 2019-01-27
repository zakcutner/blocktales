let { Block, genesis } = require('./block');

class Ledger {
  constructor() {
    this.ledger = [genesis];
  }

  static fromJSON(json) {
    let ledger = new Ledger();

    for (let jsonBlock of json) {
      if (!ledger.addBlock(Block.fromJSON(jsonBlock))) {
        return false;
      }
    }

    return ledger;
  }

  addBlock(block) {
    if (this.lastBlock.hash !== block.prevHash || this.height + 1 !== block.height || !block.isValid) {
      return false;
    }

    this.ledger.push(block);

    return true;
  }

  get lastBlock() {
    return this.ledger[this.ledger.length - 1];
  }

  get height() {
    return this.lastBlock.height;
  }

  get blocks() {
    return JSON.stringify(this.ledger.slice(1));
  }
}

module.exports = { Ledger };
