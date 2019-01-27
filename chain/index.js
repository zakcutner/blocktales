let { Client } = require('./src/client');

let client;

if (location.hash === '#main') {
  client = new Client('main');
} else if (location.hash === '#1') {
  client = new Client();
  client.mineWord("stuff");
} else {
  client = new Client();
}
