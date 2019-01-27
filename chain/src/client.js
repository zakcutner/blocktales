const Peer = require('peerjs');
const { Block } = require('./block');
const { Ledger } = require('./ledger');
const Worker = require('./miner.worker');

const KNOWN_PEER = 'main';
const CONNECTION_OPTIONS = {
  host: '138.68.146.75',
  port: 8000,
  path: '/'
};

let miner = new Worker();

function removeFromArray(arr, elem) {
  let index = arr.indexOf(elem);

  if (index >= 0) {
    arr.splice(index, 1);
  }
}

class Client {
  constructor(wordCallback, ledgerCallback, suggestionCallback, name = false) {
    this.fringe = [];
    this.peers = [];
    this.connections = [];
    this.ledger = new Ledger();
    this.name = name;
    this.wordCallback = wordCallback;
    this.ledgerCallback = ledgerCallback;
    this.suggestionCallback = suggestionCallback;

    if (name) {
      this.peer = new Peer(name, CONNECTION_OPTIONS);
    } else {
      this.peer = new Peer(CONNECTION_OPTIONS);
    }

    this.peer.on('open', id => {
      this.name = id;

      if (this.name !== KNOWN_PEER) {
        this._connect(KNOWN_PEER);
      }
    });

    this.peer.on('connection', connection => {
      this._connection_callback(connection);
    });

    miner.addEventListener('message', event => {
      let block = Block.fromJSON(event.data);

      if (this.ledger.addBlock(block)) {
        this.wordCallback(block.data);

        this._broadcast(JSON.stringify({
          type: 'block',
          block: event.data
        }));
      }
    });
  }

  mineWord(word) {
    let block = new Block(this.ledger.lastBlock, word);

    this._broadcast(JSON.stringify({
      type: 'suggestion',
      word: word
    }));

    miner.postMessage(block);
  }

  _broadcast(message) {
    for (let connection of this.connections) {
      connection.send(message);
    }
  }

  _connect(peer) {
    if (this.peers.includes(peer) || this.fringe.includes(peer) || peer === this.name) {
      return;
    }

    this.fringe.push(peer);
    let connection = this.peer.connect(peer);

    connection.on('open', () => {
      this._connection_callback(connection);

      connection.send(JSON.stringify({ type: 'ready' }));
    });
  }

  _connection_callback(connection) {
    removeFromArray(this.fringe, connection.peer);

    this.peers.push(connection.peer);
    this.connections.push(connection);

    connection.on('data', data => {
      let obj = JSON.parse(data);

      switch (obj.type) {
        case 'ready':
          connection.send(JSON.stringify({
            type: 'welcome',
            peers: this.peers,
            ledger: this.ledger.blocks
          }));

          break;

        case 'welcome':
          let candidateLedger = Ledger.fromJSON(obj.ledger);

          if (candidateLedger && candidateLedger.height > this.ledger.height) {
            this.ledger = candidateLedger;
            miner.postMessage('terminate');
            this.ledgerCallback(this.ledger.ledger.map(block => block.data).join(' '));
          }

          for (let peer of obj.peers) {
            this._connect(peer);
          }

          break;

        case 'block':
          let block = Block.fromJSON(obj.block);

          if (this.ledger.addBlock(block)) {
            miner.postMessage('terminate');
            this.wordCallback(block.data);
          }

          break;

        case 'suggestion':
          // TODO: verify
          this.suggestionCallback(obj.word);
          break;
      }
    });

    connection.on('close', () => {
      removeFromArray(this.connections, connection);
      removeFromArray(this.peers, connection.peer);

      this._connect(connection.peer);
    });

    connection.on('error', console.error);
  }
}

module.exports = { Client };
