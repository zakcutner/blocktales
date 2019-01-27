const Peer = require("peerjs");
const { Block } = require("./block");
const { Ledger } = require("./ledger");
const Worker = require("./miner.worker");

const KNOWN_PEER = "main";
const CONNECTION_OPTIONS = {
  host: "broker.blocktales.ml",
  port: 80,
  path: "/",
  proxied: true
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

    this.peer.on("open", id => {
      this.name = id;

      if (this.name !== KNOWN_PEER) {
        this._connect(KNOWN_PEER);
      }
    });

    this.peer.on("connection", connection => {
      this._connection_callback(connection);
    });

    miner.addEventListener("message", async event => {
      let block = Block.fromJSON(event.data);

      if (await this.ledger.addBlock(block)) {
        this.wordCallback(block.data);

        this._broadcast(
          JSON.stringify({
            type: "block",
            block: event.data
          })
        );
      }
    });
  }

  mineWord(word) {
    let block = new Block(this.ledger.lastBlock, word);

    this._broadcast(
      JSON.stringify({
        type: "suggestion",
        word: word
      })
    );

    miner.postMessage(block);
  }

  _broadcast(message) {
    for (let connection of this.connections) {
      connection.send(message);
    }
  }

  _connect(peer) {
    if (
      this.peers.includes(peer) ||
      this.fringe.includes(peer) ||
      peer === this.name
    ) {
      return;
    }


    let connection = this.peer.connect(peer);

    if (!connection) {
      setTimeout(() => _connect(peer), 1000);
      return;
    }

    this.fringe.push(peer);

    connection.on("open", () => {
      removeFromArray(this.fringe, connection.peer);
      this._connection_callback(connection);

      connection.send(JSON.stringify({ type: "ready" }));
    });
  }

  _connection_callback(connection) {
    this.peers.push(connection.peer);
    this.connections.push(connection);

    connection.on("data", async data => {
      let obj = JSON.parse(data);
      let candidateLedger;

      switch (obj.type) {
        case "ready":
          connection.send(
            JSON.stringify({
              type: "welcome",
              peers: this.peers,
              ledger: this.ledger.blocks
            })
          );

          break;

        case "welcome":
          candidateLedger = await Ledger.fromJSON(obj.ledger);

          if (candidateLedger && candidateLedger.height > this.ledger.height) {
            this.ledger = candidateLedger;
            miner.postMessage("terminate");
            this.ledgerCallback(this.ledger.toString());
          } else if (connection.peer === KNOWN_PEER && candidateLedger.height === 0) {
            this.ledgerCallback(this.ledger.toString());
          }

          for (let peer of obj.peers) {
            this._connect(peer);
          }

          break;

        case 'getLedger':
          connection.send(JSON.stringify({
            type: 'ledger',
            ledger: this.ledger.blocks
          }));

          break;

        case 'ledger':
          candidateLedger = await Ledger.fromJSON(obj.ledger);

          if (candidateLedger && candidateLedger.height > this.ledger.height) {
            this.ledger = candidateLedger;
            miner.postMessage('terminate');
            this.ledgerCallback(this.ledger.ledger.map(block => block.data).join(' '));
          }

          break;

        case 'block':
          let block = Block.fromJSON(obj.block);

          if (await this.ledger.addBlock(block)) {
            miner.postMessage("terminate");
            this.wordCallback(block.data);
          } else {
            // Query ledger to see if it's more up to date
            connection.send(JSON.stringify({
              type: 'getLedger'
            }));
          }

          break;

        case "suggestion":
          this.suggestionCallback(obj.word);
          break;
      }
    });

    connection.on("close", () => {
      removeFromArray(this.connections, connection);
      removeFromArray(this.peers, connection.peer);

      // this._connect(connection.peer);
    });

    connection.on("error", console.error);
  }
}

module.exports = { Client };
