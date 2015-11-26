/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import data from './data.json';

// Model types
class User extends Object {}
class Snapshot extends Object {}

// Mock data
var viewer = new User();
viewer.id = '1';
viewer.name = 'Anonymous';

var snapshots = data.map((item, i) => {
  var snapshot = new Snapshot();
  snapshot.id = `${i}`;
  snapshot.time = item.time;
  snapshot.buildings = item.buildings;
  snapshot.buildings.map((building, i) => {
    building.id = `${snapshot.id}${i}`;
    building.pcs.id = `${building.id}_pcs`;
  });
  return snapshot;
});

module.exports = {
  // Export methods that your schema can use to interact with your database
  getUser: (id) => id === viewer.id ? viewer : null,
  getViewer: () => viewer,
  getSnapshot: (id) => snapshots.find(s => s.id === id),
  getSnapshots: () => snapshots,
  User,
  Snapshot
};
