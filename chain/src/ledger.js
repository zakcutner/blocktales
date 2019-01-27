let { Block, genesis } = require('./block');
let { validWord } = require('nlp');

class Ledger {
  constructor() {
    this.ledger = [genesis];
  }

  async addBlock(block) {
    let valid = !(await validWord(this.toString(), block.data));

    if (this.lastBlock.hash !== block.prevHash || this.height + 1 !== block.height || !block.isValid || valid) {
      if (valid) {
        console.log('Not valid word');
      }
      return false;
    }

    this.ledger.push(block);

    return true;
  }

  toString() {
    return this.ledger.map(block => block.data).join(' ');
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
