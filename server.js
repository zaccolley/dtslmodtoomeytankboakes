require('dotenv').load(); // get .env values

import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { Schema } from './src/data/schema';

/* Allow console.logs and other shit in this file */
/* eslint-disable no-console, quotes, space-infix-ops */

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;

// Expose a GraphQL endpoint
const graphQLServer = express();

graphQLServer.use('/', graphQLHTTP({
  graphiql: true,
  pretty: true,
  schema: Schema,
}));

graphQLServer.listen(GRAPHQL_PORT, () => {
  console.log(` 📊  GraphQL server is now running on http://localhost:${GRAPHQL_PORT}`+``);
});

// Serve the Relay app
const compiler = webpack({
  entry: path.resolve(__dirname, 'src', 'app.js'),
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: { stage: 0, plugins: ['./build/babelRelayPlugin'] },
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'autoprefixer?browsers=last 2 versions', 'sass']
      }
    ]
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, './styles')]
  },
  output: { filename: 'app.js', path: '/' }
});

const app = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
  publicPath: '/src/',
  stats: {colors: true}
});

// Serve static resources
app.use('/', express.static(path.resolve(__dirname, 'public')));
app.listen(APP_PORT, () => {
  console.log(` 💻  The app server is now running on http://localhost:${APP_PORT}\n`);
});
