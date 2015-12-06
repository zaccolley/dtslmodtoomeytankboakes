/* Disable some linting for clarity */
/* eslint-disable no-unused-vars, no-use-before-define */

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
} from './api';

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
const { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    const { type, id } = fromGlobalId(globalId);
    if (type === 'User') {
      return getUser(id);
    } else if (type === 'Snapshot') {
      return getSnapshot(id);
    } // else
    return null;
  },
  (obj) => {
    if (obj instanceof User) {
      return userType;
    } else if (obj instanceof Snapshot) {
      return snapshotType;
    } // else

    return null;
  }
);

/**
 * Define your own types here
 */

const userType = new GraphQLObjectType({
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

const snapshotType = new GraphQLObjectType({
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

const buildingType = new GraphQLObjectType({
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
    occupied: {
      type: GraphQLInt,
      description: 'Occupied pcs at this level'
    },
    total: {
      type: GraphQLInt,
      description: 'Total pcs at this level'
    },
    areas: {
      type: new GraphQLList(areaType),
      description: 'Areas in the building'
    }
  }),
  interfaces: [nodeInterface],
});

const areaType = new GraphQLObjectType({
  name: 'Area',
  description: 'Areas in the building',
  fields: () => ({
    id: globalIdField('Area'),
    reference: {
      type: GraphQLString,
      description: 'A short code for referencing the area'
    },
    name: {
      type: GraphQLString,
      description: 'The name of the area'
    },
    location: {
      type: GraphQLString,
      description: 'The location'
    },
    occupied: {
      type: GraphQLInt,
      description: 'Occupied pcs at this level'
    },
    total: {
      type: GraphQLInt,
      description: 'Total pcs at this level'
    },
    groupings: {
      type: new GraphQLList(groupingType),
      description: 'Groupings in the areas'
    }
  }),
  interfaces: [nodeInterface],
});

const groupingType = new GraphQLObjectType({
  name: 'Grouping',
  description: 'groups ennet',
  fields: () => ({
    id: globalIdField('Grouping'),
    location: {
      type: GraphQLString,
      description: 'The location'
    },
    occupied: {
      type: GraphQLInt,
      description: 'Occupied pcs at this level'
    },
    total: {
      type: GraphQLInt,
      description: 'Total pcs at this level'
    },
    pcs: {
      type: new GraphQLList(pcType),
      description: 'pcs in the groupings'
    }
  }),
  interfaces: [nodeInterface],
});

const pcType = new GraphQLObjectType({
  name: 'PC',
  description: 'PC stuff',
  fields: () => ({
    id: globalIdField('PC'),
    user: {
      type: GraphQLString,
      description: 'Student ID or false'
    }
  }),
  interfaces: [nodeInterface],
});

/**
 * Define your own connection types here
 */
const { connectionType: snapshotConnection } =
        connectionDefinitions({name: 'Snapshot', nodeType: snapshotType});

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
const queryType = new GraphQLObjectType({
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
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
  })
});

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export const Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  // mutation: mutationType
});
