import { db } from './dbClient';

// Model types
class User extends Object {}
class Snapshot extends Object {}

function getSnapshot(key) {
  return new Promise((resolve, reject) => {

    db.view('snapshots/all', { key }, (err, results) => {

      if (err) {
        return reject(err);
      }

      const data = results[0];

      return resolve(data);

    });
  });
}

function getSnapshots() {
  return new Promise((resolve, reject) => {

    db.view('snapshots/all', { limit: 5 }, (err, response) => {
      if (err) {
        return reject(`✗ Didn't work...\n Database error: ${err}`);
      }

      const data = response.map(doc => doc);

      const output = data.map(result => {
        result.id = result._id;
        delete result._id;

        result.buildings.map(building => {
          building.id = building.reference + result.id;

          building.areas.map((area, areaCount) => {
            area.id = building.id + areaCount;

            area.groupings.map((grouping, groupingCount) => {
              grouping.id = area.id + groupingCount;

              grouping.pcs.map((pc, pcCount) => {
                pc.id = grouping.id + pcCount;

                return pc;
              });

              return grouping;
            });

            return area;
          });

          return building;
        });

        return result;
      });

      resolve(output);

    });

  });
}

const viewer = new User();
viewer.id = '1';
viewer.name = 'Anonymous';

module.exports = {
  // Export methods that your schema can use to interact with your database
  getUser: (id) => id === viewer.id ? viewer : null,
  getViewer: () => viewer,
  getSnapshot,
  getSnapshots,
  User,
  Snapshot
};
