import { options, client } from './dbClient';
import util from 'util';

/* Allow console.logs in this file */
/* eslint-disable no-console */

function unescapeString(string) {
  return string.replace(/\\,/g, ',').replace(/\\ /g, ' ');
}

console.log('Running test script...');

const time = '2015-11-04T01:19:32Z';

const query = `SELECT * FROM availability WHERE time = '${time}'`;
client.query([options.database], query, (err, results) => {

  if (err) {
    return console.log(err);
  }

  const data = results[0];

  const output = data.map(result => {
    result.buildings = JSON.parse(unescapeString(result.buildings));
    return result;
  });

  console.log(util.inspect(output, { showHidden: false, depth: null }));

});
