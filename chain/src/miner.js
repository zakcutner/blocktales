
function mineBlock(block) {
  while (!block.validHash) {
    block.nonce = Math.random();
  }

  return block;
}

module.exports = { mineBlock };
