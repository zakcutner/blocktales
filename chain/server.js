let { Client } = require('./src/client');

let client;

function wordCallback(word) {
  console.log('New word:' + word);
}

function ledgerCallback(ledger) {
  console.log('New ledger: ' + ledger);
}

if (location.hash === '#main') {
  client = new Client(wordCallback, ledgerCallback, 'main');
} else if (location.hash === '#1') {
  client = new Client(wordCallback, ledgerCallback);
  client.mineWord("stuff");
} else {
  client = new Client(wordCallback, ledgerCallback);
}
