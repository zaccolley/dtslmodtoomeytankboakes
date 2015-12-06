import { db } from './db';

// Model types
class User extends Object {}
class Snapshot extends Object {}

function getSnapshot(key) {
  return new Promise((resolve, reject) => {

    db.view('snapshots/all', { key }, (err, response) => {

      if (err) {
        return reject(err);
      }

      const data = response.map(doc => doc);

      const output = data.map(result => {
        result.id = result._id;
        delete result._id;
      })[0];

      return resolve(output);

    });
  });
}

function getSnapshots() {
  return new Promise((resolve, reject) => {

    db.view('snapshots/byTime', { key: '1446599972' }, (err, response) => {
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

              function calcFreePcs(pcs, frees, pcsFree, i, amount) {
                if (i < pcs.length - amount) {

                  const newPc = pcs[i + amount];
                  const pcOccupied = newPc.user.length;

                  // if the pc isnt available or we've reached the end of the availabiliies
                  if (pcOccupied || amount > frees.length - 1) {
                    return false;
                  }

                  const newPcsFree = [newPc, ...pcsFree].sort();
                  frees[amount].push(newPcsFree);
                  return calcFreePcs(pcs, frees, newPcsFree, i, amount + 1);
                }

              }

              const frees = [
                [], [], [], []
              ];

              for (let i = 0; i < grouping.pcs.length; i++) {
                const amount = 0;
                const pcsFree = [];

                calcFreePcs(grouping.pcs, frees, pcsFree, i, amount);
              }

              grouping.frees = frees;

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
