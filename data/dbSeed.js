import { options, client } from './db';
import request from 'request';

console.log('Dropping database...');

client.dropDatabase(options.database, (err) => {

  if (err) {
    return console.log(err);
  }

  console.log('Database dropped!');
  console.log('Creating database');

  client.createDatabase(options.database, (err) => {
    if (err) {
      return console.log(err);
    }

    console.log('Database created!');
    console.log('Requesting data from API...');

    new Promise((resolve, reject) => {
      request("http://labs.calcroft.co/pc-data.json", (err, response, body) => {
        if(err) {
          return reject(err);
        }

        if(response.statusCode === 200) {
          console.log('Got data successfully!');
          return resolve(JSON.parse(body));
        }

        reject([err, response.statusCode]);
      });
    }).then(data => {

      console.log('Processing data...');

      var snapshots = [];

      for (var time in data) {
        if (data.hasOwnProperty(time)) {
          var dataItem = data[time];

          // check if this is valid data in an array not a error
          if (Array.isArray(dataItem)) {
            try {
              const buildings = escapeString(JSON.stringify(generateBuildings(dataItem)));
              snapshots.push([{ time, buildings }]);
            } catch(e) { // catch any naughty data
              console.log(dataItem);
              console.log('Error: ', e);
              return;
            }
          }

        }
      }

      console.log('Data processed successfully!');
      console.log('Writing data to database...');

      function escapeString(string) {
        return string.replace(/,/g, '\\,').replace(/ /g, '\\ ');
      }

      client.writePoints("availability", snapshots, {
        database: options.database,
        precision: 's'
      }, (err) => {
        if (err) {
          return console.log(err);
        }

        console.log('Data written to the database');

      });

    }).catch(val => {
      console.log(val);
    });

  });

});

function generateBuildings(data){
  return data.map(item => {
    return {
      reference: item.building.reference,
      name: item.building.name,
      open: item.open,
      areas: generateAreas(item.building.reference, item.in_use, item.total)
    };
  });
}

function generateAreas(reference, occupied, total){

  var areas = [
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

function sharePcs(areas, occupied, total){

  areas = shareNumber(areas, occupied, true);
  areas = shareNumber(areas, total, false);


  return areas;
}

function shareNumber(areas, number, occupied){
  // each given that
  var quotient = Math.floor(number / areas.length);
  var remainder = (number % areas.length);

  for (var i = 0; i < areas.length; i++) {
    var area = areas[i];

    if (occupied) {
      area.occupied += quotient;
    }else{
      area.total += quotient;
    }

    if (remainder > 0) {
      if (occupied) {
        area.occupied += 1;
      }else{
        area.total += 1;
      }

      remainder--;
    }
  }

  return areas;
}

function generateGroupings(occupied, total){

  var groupings = [
    {
      location: '#',
      pcs: generatePcs(occupied, total)
    }
  ];

  return groupings;
}

function generatePcs(occupied, total){

  var pcs = [];

  for (var i = 0; i < total; i++) {

    var isBroken = !!Math.round(Math.random());
    var isOccupied = false;

    // check if we still have occupied pcs to generate
    if (occupied > 0){

      // 50/50 chance of it being is occupied
      isOccupied = Math.round(Math.random());

      // if it is occupied then we decrease the amount of
      // occupied pcs needed to generate
      if (isOccupied) {
        occupied--;
      }

    }

    var pc = {
      broken: isBroken,
      user: (isOccupied ? generateStudentID() : false),
      software: []
    };

    pcs.push(pc);

  }

  return pcs;

}

function generateStudentID(){

  var studentId = 'up';

  for (var i = 0; i < 5; i++) {
    var randomNo = String(Math.ceil(Math.random() * 10));
    studentId += randomNo;
  }

  return studentId;
}
