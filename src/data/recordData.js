import fs from 'fs';
import request from 'request';
const accessToken = fs.readFileSync(__dirname + '/token');

function addToDb(responseBody) {
  const pcData = require('./recordedData.json');
  pcData[Math.round(Date.now() / 1000)] = responseBody;
  fs.writeFileSync(__dirname + '/recordedData.json', JSON.stringify(pcData));
}

if (!accessToken) {
  throw new Error("No token, add token to file called 'token' in this dir");
}

const apiUri = `http://ssd.api.port.ac.uk/v1/buildings/openaccess?access_token=${accessToken}`;

request(apiUri, (err, response, body) => {
  if (err || response.statusCode !== 200) {
    return addToDb({
      error: err,
      statusCode: response.statusCode
    });
  }
  addToDb(JSON.parse(body));
});
