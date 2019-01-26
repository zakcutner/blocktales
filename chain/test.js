const { Block, genesis } = require('./src/block');
const { mineBlock } = require('./src/miner');
const { performance } = require('perf_hooks');

let block = new Block(genesis, "there");
let start = performance.now();

mineBlock(block);

let time = performance.now() - start;

console.log(`Time: ${time}ms`);
console.log(`Hash: ${block.hash}`);

console.dir(block);
