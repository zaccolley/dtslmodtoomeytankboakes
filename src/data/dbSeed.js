import { db } from './dbClient';
import request from 'request';

/* Allow console.logs in this file */
/* eslint-disable no-console */

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function shareAmount(items, inputOccupied, inputTotal) {

  let occupiedTotal = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // create occupied property
    item.occupied = 0;

    const itemRatio = item.total / inputTotal;
    const occupiedAmount = Math.floor(itemRatio * inputOccupied);
    item.occupied = occupiedAmount;

    // add this to the total
    occupiedTotal += occupiedAmount;
  }

  let leftOverOccupied = inputOccupied - occupiedTotal;

  // distribute left overs randomly
  while (leftOverOccupied > 0) {
    const randomAreaIndex = Math.floor(Math.random() * items.length);
    items[randomAreaIndex].occupied += 1;

    leftOverOccupied--;
  }

  return items;
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

  let occupiedCount = occupied;

  for (let i = 0; i < total; i++) {

    let user = false;

    // check if we still have occupied pcs to generate
    if (occupiedCount > 0) {

      user = generateStudentID();

      occupiedCount--;
    }

    pcs.push({ user });

  }

  shuffleArray(pcs);

  return pcs;

}

function generateGroupings(area, occupied, total) {

  let groupings = shareAmount(area.groupings, occupied, total);

  groupings = groupings.map(grouping => {
    grouping.pcs = generatePcs(grouping.occupied, grouping.total);
    return grouping;
  });

  return groupings;
}

function generateAreas(reference, occupied, total) {

  let areas = [
    {
      name: 'All',
      location: 'forward',
      total: 0,
      groupings: [
        { total: 0 }
      ]
    }
  ];

  if (reference === 'ag') {
    areas = [
      {
        name: 'Open Access Area',
        location: 'forward',
        total: 12,
        groupings: [
          { total: 6 },
          { total: 6 }
        ]
      }
    ];
  } else if (reference === 'po') {
    areas = [
      {
        name: 'Open Access #1',
        location: 'ground floor',
        total: 32,
        groupings: [
          { total: 4 },
          { total: 4 },
          { total: 6 },
          { total: 6 },
          { total: 7 },
          { total: 5 }
        ]
      },
      {
        name: 'Open Access #2',
        location: 'first floor',
        total: 32,
        groupings: [
          { total: 4 },
          { total: 4 },
          { total: 6 },
          { total: 6 },
          { total: 7 },
          { total: 5 }
        ]
      },
      {
        name: 'Shared Access #1',
        location: 'first floor left',
        total: 25,
        groupings: [
          { total: 7 },
          { total: 6 },
          { total: 5 },
          { total: 4 },
          { total: 3 }
        ]
      },
      {
        name: 'Shared Access #2',
        location: 'first floor right',
        total: 12,
        groupings: [
          { total: 7 },
          { total: 6 }
        ]
      },
      {
        name: 'Open Access #3',
        location: 'second floor',
        total: 25,
        groupings: [
          { total: 4 },
          { total: 6 },
          { total: 5 },
          { total: 5 },
          { total: 5 }
        ]
      }
    ];
  } else if (reference === 'pk') {
    areas = [
      {
        name: 'Open Access #1',
        location: 'left left',
        total: 17,
        groupings: [
          { total: 5 },
          { total: 4 },
          { total: 4 },
          { total: 4 }
        ]
      },
      {
        name: 'Open Access #2',
        location: 'left center',
        total: 17,
        groupings: [
          { total: 5 },
          { total: 5 },
          { total: 4 },
          { total: 3 }
        ]
      },
      {
        name: 'Open Access #1',
        location: 'left right',
        total: 16,
        groupings: [
          { total: 4 },
          { total: 4 },
          { total: 4 },
          { total: 4 }
        ]
      }
    ];
  } else if (reference === 'ul') {
    areas = [
      {
        name: 'Cafe',
        location: 'forwards right',
        total: 8,
        groupings: [
          { total: 8 }
        ]
      },
      {
        name: 'Open Access Corridor',
        location: 'forwards',
        total: 8,
        groupings: [
          { total: 5 },
          { total: 3 }
        ]
      },
      {
        name: 'Open Access #1',
        location: 'forwards first room',
        total: 23,
        groupings: [
          { total: 5 },
          { total: 5 },
          { total: 5 },

          { total: 8 }
        ]
      },
      {
        name: 'Open Access #2',
        location: 'forwards second room',
        total: 24,
        groupings: [
          { total: 5 },
          { total: 5 },
          { total: 5 },

          { total: 9 }
        ]
      },
      {
        name: 'Open Access #3',
        location: 'forwards third room',
        total: 17,
        groupings: [
          { total: 5 },
          { total: 5 },
          { total: 7 }
        ]
      },
      {
        name: 'Open Access #4',
        location: 'forwards round corner third room',
        total: 24,
        groupings: [
          { total: 6 },
          { total: 6 },
          { total: 6 },
          { total: 6 }
        ]
      },
      {
        name: 'Open Access #5',
        location: 'forwards round corner fourth room',
        total: 24,
        groupings: [
          { total: 6 },
          { total: 6 },
          { total: 6 },
          { total: 6 }
        ]
      },
      {
        name: 'Open Access #6',
        location: 'forwards round corner fifth room',
        total: 24,
        groupings: [
          { total: 6 },
          { total: 6 },
          { total: 6 },
          { total: 6 }
        ]
      },
      {
        name: 'Social Library',
        location: 'left',
        total: 49,
        groupings: [
          { location: 'farthest table left', total: 7 },

          { location: '6 table left, left side', total: 5 },
          { location: '6 table left, right side', total: 5 },

          { location: '5 table left, left side', total: 4 },
          { location: '5 table left, right side', total: 4 },

          { location: '4 table left, left side', total: 3 },
          { location: '4 table left, right side', total: 3 },

          { location: '3 table left, left side', total: 3 },
          { location: '3 table left, right side', total: 3 },

          { location: '2 table left, left side', total: 3 },
          { location: '2 table left, right side', total: 3 },

          { location: '1 table left, left side', total: 3 },
          { location: '1 table left, right side', total: 3 },
        ]
      },
      {
        name: 'Main Library',
        location: 'right',
        total: 200,
        groupings: [
          { location: '0 0 star table top left', total: 6 },
          { location: '0 0 star table top right', total: 6 },
          { location: '0 0 star table bottom', total: 6 },

          { location: '0 1 star table top left', total: 6 },
          { location: '0 1 star table top right', total: 6 },
          { location: '0 1 star table bottom', total: 6 },

          { location: '1 0 star table top left', total: 6 },
          { location: '1 0 star table top right', total: 6 },
          { location: '1 0 star table bottom', total: 6 },

          { location: '1 1 star table top left', total: 6 },
          { location: '1 1 star table top right', total: 6 },
          { location: '1 1 star table bottom', total: 6 },

          { location: '1 2 star table top left', total: 6 },
          { location: '1 2 star table top right', total: 6 },
          { location: '1 2 star table bottom', total: 6 },

          { location: '2 1 star table top', total: 6 },
          { location: '2 1 star table bottom right', total: 6 },
          { location: '2 1 star table bottom left', total: 6 },

          { location: '2 2 star table top', total: 6 },
          { location: '2 2 star table bottom right', total: 6 },
          { location: '2 2 star table bottom left', total: 6 },

          { location: '3 1 star table top left', total: 6 },
          { location: '3 1 star table top right', total: 6 },
          { location: '3 1 star table bottom', total: 6 },

          { location: '8 table furthest side, top side', total: 3 },
          { location: '8 table furthest side, bottom side', total: 3 },

          { location: '7 table furthest side, top side', total: 3 },
          { location: '7 table furthest side, bottom side', total: 3 },

          { location: '6 table furthest side, left side', total: 4 },
          { location: '6 table furthest side, right side', total: 4 },

          { location: '5 table furthest side, top side', total: 4 },
          { location: '5 table furthest side, bottom side', total: 3 },

          { location: '4 table furthest side, top side', total: 4 },
          { location: '4 table furthest side, bottom side', total: 4 },

          { location: '3 table furthest side, top side', total: 4 },
          { location: '3 table furthest side, bottom side', total: 4 },

          { location: '2 table furthest side, left side', total: 3 },
          { location: '2 table furthest side, right side', total: 3 },

          { location: '1 table furthest side, left side', total: 3 },
          { location: '1 table furthest side, right side', total: 3 },

          { location: 'next to support services', total: 1 }
        ]
      }
    ];
  }

  areas = shareAmount(areas, occupied, total);

  areas = areas.map(area => {
    area.groupings = generateGroupings(area, area.occupied, area.total);
    return area;
  });

  return areas;

}

function generateBuildings(data) {
  return data.map(item => {

    if (item.building.reference === 'ag') {
      item.in_use = 5;
    } else if (item.building.reference === 'ul') {
      item.in_use = 333;
    } else if (item.building.reference === 'pk') {
      item.in_use = 35;
    } else if (item.building.reference === 'po') {
      item.in_use = 102;
    }

    return {
      reference: item.building.reference,
      name: item.building.name,
      open: item.open,
      occupied: item.in_use,
      total: item.total,
      areas: generateAreas(item.building.reference, item.in_use, item.total)
    };
  });
}

function createDatabase() {
  console.log('⚡ Creating database...');

  db.create();

  console.log('✓ Database created!');

  console.log('⚡ Creating views for database...');

  db.save('_design/snapshots', {
    all: {
      map: `function(doc) {
        if (doc.time && doc.buildings) {
          emit(doc._id, doc);
        }
      }`
    },
    byTime: {
      map: `function(doc) {
        if (doc.time && doc.buildings) {
          emit(doc._time, doc);
        }
      }`
    }
  });

  console.log('✓ Views created!');

  console.log('⚡ Requesting data from API...');

  new Promise((resolve, reject) => {
    request('http://labs.calcroft.co/pc-data.json', (requestErr, response, body) => {
      if (requestErr) {
        return reject(requestErr);
      }

      if (response.statusCode === 200) {
        console.log('✓ Data requested!');
        return resolve(JSON.parse(body));
      }

      reject([requestErr, response.statusCode]);
    });
  }).then(data => {

    console.log('⚡ Processing data...');

    const snapshots = [];

    for (const time in data) {
      if (data.hasOwnProperty(time)) {
        const dataItem = data[time];

        // check if this is valid data in an array not a error
        if (Array.isArray(dataItem)) {
          try {
            const buildings = generateBuildings(dataItem);
            snapshots.push({ time, buildings });
          } catch (e) { // catch any naughty data
            return console.log('✗ Generating buildings error: ', e);
          }
        }

      }
    }

    console.log('✓ Data processed into snapshots!');
    console.log('⚡ Writing snapshots to database...');

    db.save(snapshots, (databaseWriteErr) => { // eslint-disable-line no-loop-func
      if (databaseWriteErr) {
        return console.log('✗ Database error: ', databaseWriteErr);
      }

      console.log('✓ Snapshots written to database!');
    });


  }).catch(val => {
    console.log(val);
  });
}

console.log('⚡ Checking database...');

db.exists((err, exists) => {

  if (err) {
    console.log('✗ Database error: ', err);
  } else if (exists) {
    console.log('✓ Database exists!');

    console.log('⚡ Destroying database...');
    db.destroy((destroyDbErr) => {
      if (destroyDbErr) {
        return console.log('✗ Database error: ', destroyDbErr);
      }

      console.log('✓ Destroyed database!');
      createDatabase();
    });

  } else {
    console.log('✗ Database doesn\'t exists!');
    createDatabase();
  }

});
