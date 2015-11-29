import { options, client } from './db';
import util from 'util';

console.log('Running test script...');

const time = '2015-11-04T01:19:32Z';

const query = `SELECT * FROM availability WHERE time = '${time}'`;
client.query([options.database], query, (err, results) => {

  if (err) {
    return console.log(err);
  }

  const data = results[0];

  results = data.map(result => {
    result.buildings = JSON.parse(result.buildings);
    return result;
  });

  console.log(util.inspect(results, { showHidden: false, depth: null }));

});
