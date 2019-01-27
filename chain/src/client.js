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
  constructor(name = false) {
    this.peers = [];
    this.connections = [];
    this.ledger = new Ledger();
    this.name = name;

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
      if (this.ledger.addBlock(Block.fromJSON(event.data))) {
        for (let connection of this.connections) {
          connection.send(JSON.stringify({
            type: 'block',
            block: event.data
          }));
        }
      }
    });
  }

  mineWord(word) {
    let block = new Block(this.ledger.lastBlock, word);

    miner.postMessage(block);
  }

  _connect(peer) {
    let connection = this.peer.connect(peer);

    connection.on('open', () => {
      this._connection_callback(connection);

      connection.send(JSON.stringify({ type: 'ready' }));
    });
  }

  _connection_callback(connection) {
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
            miner.send('terminate');
            // TODO: update GUI
          }

          for (let peer of obj.peers) {
            if (!this.peers.includes(peer) && peer !== this.name) {
              this._connect(peer);
            }
          }

          break;

        case 'block':
          if (this.ledger.addBlock(Block.fromJSON(obj.block))) {
            miner.postMessage('terminate');
          }
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
