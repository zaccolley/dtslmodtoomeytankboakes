import fs from 'fs';
import request from 'request';

function addToDb(responseBody) {
  const pcData = require('./recordedData.json');
  pcData[Math.round(Date.now() / 1000)] = responseBody;
  fs.writeFileSync(__dirname + '/recordedData.json', JSON.stringify(pcData));
}

if (!process.env.PC_API_TOKEN) {
  throw new Error('No token, PC_API_TOKEN=token to .env. See README.');
}

const apiUri = `http://ssd.api.port.ac.uk/v1/buildings/openaccess?access_token=${process.env.PC_API_TOKEN}`;

request(apiUri, (err, response, body) => {
  if (err || response.statusCode !== 200) {
    return addToDb({
      error: err,
      statusCode: response.statusCode
    });
  }
  addToDb(JSON.parse(body));
});
