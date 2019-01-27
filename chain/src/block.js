let hash = require('crypto-js').SHA256;
let { validWord } = require('nlp');

const DIFFICULTY = 5;

class Block {
  constructor(prevBlock, data) {
    this.prevHash = prevBlock.hash;
    this.data = data;
    this.height = prevBlock.height + 1;
    this.nonce = 0;
  }

  static fromJSON(json) {
    const mockPrevBlock = {
      hash: json.prevHash,
      height: json.height - 1
    };
    let block = new Block(mockPrevBlock, json.data);

    block.nonce = json.nonce;

    return block;
  }

  get hash() {
    return hash(JSON.stringify(this)).toString();
  }

  get isValid() {
    return this.hash.startsWith('0'.repeat(DIFFICULTY));
  }

  async isValidData() {
    return await validWord(this.data);
  }
}

const genesis = new Block({ hash: '', height: -1 }, 'Once upon a time');

module.exports = { Block, genesis };
