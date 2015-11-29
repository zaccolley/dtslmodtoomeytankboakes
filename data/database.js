/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import { options, client } from './db';

// Model types
class User extends Object {}
class Snapshot extends Object {}

function getSnapshot(id){
  return new Promise((resolve, reject) => {

    const query = `SELECT * FROM availability WHERE time = '${id}'`;
    client.query([options.database], query, (err, results) => {

      if (err) {
        return reject(err);
      }

      const data = results[0];

      results = data.map(result => {
        result.buildings = JSON.parse(result.buildings);
        return result;
      });

      return resolve(results);

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

      results = data.map(result => {
        result.id = result.time;
        result.buildings = JSON.parse(result.buildings);

        result.buildings.map(building => {
          building.id = building.reference + result.id;

          building.areas.map((area, i) => {
            area.id = building.id + i;

            area.groupings.map((grouping, i) => {
              grouping.id = area.id + i;

              grouping.pcs.map((pc, i) => {
                pc.id = grouping.id + i;

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

      resolve(results);

    });

  });
}

var viewer = new User();
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
