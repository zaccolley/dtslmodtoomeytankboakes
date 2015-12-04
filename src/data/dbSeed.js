import { options, client } from './dbClient';
import request from 'request';

/* Allow console.logs in this file */
/* eslint-disable no-console */

function escapeString(string) {
  return string.replace(/,/g, '\\,').replace(/ /g, '\\ ');
}

function generateStudentID() {

  let studentId = 'up';

  for (let i = 0; i < 5; i++) {
    const randomNo = String(Math.ceil(Math.random() * 10));
    studentId += randomNo;
  }

  return studentId;
}

function generatePcs(occupied, total) {

  const pcs = [];

  for (let i = 0; i < total; i++) {

    const isBroken = !!Math.round(Math.random());
    let isOccupied = false;

    let occupiedCount = occupied;

    // check if we still have occupied pcs to generate
    if (occupiedCount > 0) {

      // 50/50 chance of it being is occupied
      isOccupied = Math.round(Math.random());

      // if it is occupied then we decrease the amount of
      // occupied pcs needed to generate
      if (isOccupied) {
        occupiedCount--;
      }

    }

    const pc = {
      broken: isBroken,
      user: (isOccupied ? generateStudentID() : false),
      software: []
    };

    pcs.push(pc);

  }

  return pcs;

}

function generateGroupings(occupied, total) {

  const groupings = [
    {
      location: '#',
      pcs: generatePcs(occupied, total)
    }
  ];

  return groupings;
}

function shareNumber(areas, number, occupied) {
  // each given that
  const quotient = Math.floor(number / areas.length);
  let remainder = (number % areas.length);

  for (let i = 0; i < areas.length; i++) {
    const area = areas[i];

    if (occupied) {
      area.occupied += quotient;
    } else {
      area.total += quotient;
    }

    if (remainder > 0) {
      if (occupied) {
        area.occupied += 1;
      } else {
        area.total += 1;
      }

      remainder--;
    }
  }

  return areas;
}

function sharePcs(areas, occupied, total) {
  let newAreas = areas;
  newAreas = shareNumber(newAreas, occupied, true);
  newAreas = shareNumber(newAreas, total, false);

  return newAreas;
}

function generateAreas(reference, occupied, total) {

  let areas = [
    {
      name: 'All',
      location: 'forward',
      percentage: 100
    }
  ];

  if (reference === 'ag') {
    areas = [
      {
        name: 'Open Access Area',
        location: 'forward',
        percentage: 100
      }
    ];
  } else if (reference === 'po') {
    areas = [
      {
        name: 'Open Access #1',
        location: 'ground floor',
        percentage: 25
      },
      {
        name: 'Open Access #2',
        location: 'first floor',
        percentage: 25
      },
      {
        name: 'Shared Access #1',
        location: 'first floor left',
        percentage: 20
      },
      {
        name: 'Shared Access #2',
        location: 'first floor right',
        percentage: 10
      },
      {
        name: 'Open Access #3',
        location: 'second floor',
        percentage: 20
      }
    ];
  } else if (reference === 'pk') {
    areas = [
      {
        name: 'Open Access #1',
        location: 'left left',
        percentage: 32
      },
      {
        name: 'Open Access #2',
        location: 'left center',
        percentage: 36
      },
      {
        name: 'Open Access #1',
        location: 'left right',
        percentage: 32
      }
    ];
  } else if (reference === 'ul') {
    areas = [
      {
        name: 'Open Access #1',
        location: 'right',
        percentage: 5
      },
      {
        name: 'Open Access #2',
        location: 'right',
        percentage: 5
      },
      {
        name: 'Open Access #3',
        location: 'right',
        percentage: 5
      },
      {
        name: 'Open Access #4',
        location: 'right',
        percentage: 5
      },
      {
        name: 'Open Access #5',
        location: 'right',
        percentage: 5
      },
      {
        name: 'Open Access #6',
        location: 'right',
        percentage: 5
      },
      {
        name: 'Shared Library',
        location: 'right',
        percentage: 25
      },
      {
        name: 'Main Library',
        location: 'right',
        percentage: 45
      }
    ];
  }

  // add default occupied and totals to areas
  areas = areas.map(area => {
    area.occupied = 0;
    area.total = 0;
    return area;
  });

  areas = sharePcs(areas, occupied, total);

  areas = areas.map(area => {

    area.groupings = generateGroupings(area.occupied, area.total);

    return area;

  });

  return areas;

}

function generateBuildings(data) {
  return data.map(item => {
    return {
      reference: item.building.reference,
      name: item.building.name,
      open: item.open,
      areas: generateAreas(item.building.reference, item.in_use, item.total)
    };
  });
}

console.log('Dropping database...');

client.dropDatabase(options.database, (err) => {

  if (err) {
    return console.log(err);
  }

  console.log('Database dropped!');
  console.log('Creating database');

  client.createDatabase(options.database, (databaseErr) => {
    if (databaseErr) {
      return console.log(databaseErr);
    }

    console.log('Database created!');
    console.log('Requesting data from API...');

    new Promise((resolve, reject) => {
      request('http://labs.calcroft.co/pc-data.json', (requestErr, response, body) => {
        if (requestErr) {
          return reject(requestErr);
        }

        if (response.statusCode === 200) {
          console.log('Got data successfully!');
          return resolve(JSON.parse(body));
        }

        reject([err, response.statusCode]);
      });
    }).then(data => {

      console.log('Processing data...');

      const snapshots = [];

      for (const time in data) {
        if (data.hasOwnProperty(time)) {
          const dataItem = data[time];

          // check if this is valid data in an array not a error
          if (Array.isArray(dataItem)) {
            try {
              const buildings = escapeString(JSON.stringify(generateBuildings(dataItem)));
              snapshots.push([{ time, buildings }]);
            } catch (e) { // catch any naughty data
              console.log(dataItem);
              console.log('Error: ', e);
              return;
            }
          }

        }
      }

      console.log('Data processed successfully!');
      console.log('Writing data to database...');

      client.writePoints('availability', snapshots, {
        database: options.database,
        precision: 's'
      }, (databaseWriteErr) => {
        if (databaseWriteErr) {
          return console.log(databaseWriteErr);
        }

        console.log('Data written to the database');

      });

    }).catch(val => {
      console.log(val);
    });

  });

});
