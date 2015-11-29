/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  connectionFromPromisedArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  // Import methods that your schema can use to interact with your database
  User,
  Snapshot,
  getUser,
  getViewer,
  getSnapshot,
  getSnapshots
} from './database';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Snapshot') {
      return getSnapshot(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Snapshot)  {
      return snapshotType;
    } else {
      return null;
    }
  }
);

/**
 * Define your own types here
 */

var userType = new GraphQLObjectType({
  name: 'User',
  description: 'A person who uses our app',
  fields: () => ({
    id: globalIdField('User'),
    snapshots: {
      type: snapshotConnection,
      description: 'A person\'s collection of snapshots',
      args: connectionArgs,
      resolve: (_, args) => connectionFromPromisedArray(getSnapshots(), args)
    },
  }),
  interfaces: [nodeInterface],
});

var snapshotType = new GraphQLObjectType({
  name: 'Snapshot',
  description: 'A snapshot',
  fields: () => ({
    id: globalIdField('Snapshot'),
    time: {
      type: GraphQLString,
      description: 'The time snapshot was taken',
    },
    buildings: {
      type: new GraphQLList(buildingType),
      description: 'The buildings for this snapshot'
    }
  }),
  interfaces: [nodeInterface],
});


var buildingType = new GraphQLObjectType({
  name: 'Building',
  description: 'A building',
  fields: () => ({
    id: globalIdField('Building'),
    reference: {
      type: GraphQLString,
      description: 'A short code for referencing the building'
    },
    name: {
      type: GraphQLString,
      description: 'The full name of the building'
    },
    open: {
      type: GraphQLBoolean,
      description: 'Whether is building is open or not'
    },
    areas: {
      type: new GraphQLList(areaType),
      description: 'Areas in the building'
    }
  }),
  interfaces: [nodeInterface],
});

var areaType = new GraphQLObjectType({
  name: 'Area',
  description: 'Areas in the building',
  fields: () => ({
    id: globalIdField('Area'),
    name: {
      type: GraphQLString,
      description: 'The name of the area'
    },
    location: {
      type: GraphQLString,
      description: 'The location'
    },
    groupings: {
      type: new GraphQLList(groupingType),
      description: 'Groupings in the areas'
    }
  }),
  interfaces: [nodeInterface],
});

var groupingType = new GraphQLObjectType({
  name: 'Grouping',
  description: 'groups ennet',
  fields: () => ({
    id: globalIdField('Grouping'),
    location: {
      type: GraphQLString,
      description: 'The location'
    },
    pcs: {
      type: new GraphQLList(pcType),
      description: 'pcs in the groupings'
    }
  }),
  interfaces: [nodeInterface],
});

var pcType = new GraphQLObjectType({
  name: 'PC',
  description: 'PC stuff',
  fields: () => ({
    id: globalIdField('PC'),
    user: {
      type: GraphQLString,
      description: 'Student ID or false'
    },
    broken: {
      type: GraphQLBoolean,
      description: 'Is it borked?'
    }
  }),
  interfaces: [nodeInterface],
});

/**
 * Define your own connection types here
 */
var {connectionType: snapshotConnection} =
  connectionDefinitions({name: 'Snapshot', nodeType: snapshotType});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    viewer: {
      type: userType,
      resolve: () => getViewer(),
    },
  }),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  // mutation: mutationType
});
