let { Block, genesis } = require('./block');

class Ledger {
  constructor() {
    this.ledger = [genesis];
  }

  async addBlock(block) {
    if (this.lastBlock.hash !== block.prevHash || this.height + 1 !== block.height || !block.isValid || !(await block.isValidData())) {
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
    return this.ledger.slice(1);
  }
}

Ledger.fromJSON = async function(json) {
  let ledger = new Ledger();

  for (let jsonBlock of json) {
    if (!(await ledger.addBlock(Block.fromJSON(jsonBlock)))) {
      return false;
    }
  }

  return ledger;
}

module.exports = { Ledger };
