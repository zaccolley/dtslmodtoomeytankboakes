const getbabelRelayPlugin = require('babel-relay-plugin');
const schema = require('../src/data/schema.json');

module.exports = getbabelRelayPlugin(schema.data);
