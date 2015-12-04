/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import { options, client } from './dbClient';

// Model types
class User extends Object {}
class Snapshot extends Object {}

function unescapeString(string) {
  return string.replace(/\\,/g, ',').replace(/\\ /g, ' ');
}

function getSnapshot(id) {
  return new Promise((resolve, reject) => {

    const query = `SELECT * FROM availability WHERE time = '${id}'`;
    client.query([options.database], query, (err, results) => {

      if (err) {
        return reject(err);
      }

      const data = results[0];

      const output = data.map(result => {
        result.buildings = JSON.parse(unescapeString(result.buildings));
        return result;
      });

      return resolve(output);

    });
  });
}

function getSnapshots() {
  return new Promise((resolve, reject) => {

    const query = `SELECT * FROM availability`;
    client.query([options.database], query, (err, results) => {

      if (err) {
        return reject(err);
      }

      const data = results[0];

      const output = data.map(result => {
        result.id = result.time;
        result.buildings = JSON.parse(unescapeString(result.buildings));

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
