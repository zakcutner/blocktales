let { Client } = require('./src/client');

let client;

function wordCallback(word) {
  console.log('New word:' + word);
}

function ledgerCallback(ledger) {
  console.log('New ledger: ' + ledger);
}

function suggestionCallback(word) {
  console.log('New suggestion: ' + word);
}

if (location.hash === '#main') {
  client = new Client(wordCallback, ledgerCallback, suggestionCallback, 'main');
} else if (location.hash === '#1') {
  client = new Client(wordCallback, ledgerCallback, suggestionCallback);

  setTimeout(() => client.mineWord("stuff"), 1000)

} else {
  client = new Client(wordCallback, ledgerCallback, suggestionCallback);
}
