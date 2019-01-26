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
    let prevBlock = ledger[-1];

    // TODO: verify data validity
    if (prevBlock.hash !== block.prevHash || prevBlock.height + 1 !== block.height || !block.validHash) {
      return false;
    }

    this.ledger.push(block);

    return true;
  }

  toJSON() {
    return JSON.stringify(this.ledger.slice(1));
  }
}
