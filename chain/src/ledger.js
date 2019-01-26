let { genesis } = require('./block');

class Ledger {
  constructor() {
    this.ledger = [genesis];
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
}
