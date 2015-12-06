import { db } from './db';

/* Allow console.logs in this file */
/* eslint-disable no-console */

db.view('snapshots/all', { limit: 5 }, (err, response) => {
  if (err) {
    return console.log(`✗ Didn't work...\n Database error: ${err}`);
  }

  const docs = response.map(doc => doc);

  console.log(`✓ Seems to have worked. Here\'s what came back:\n`);
  console.dir(docs);
});
