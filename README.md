# WEBRES - Sprint 1 - Data Visualization Sprint

This repo contains the following information:

1. Our code for the sprint.
2. Wiki containing all of our documents and findings throughout the sprint. [ Find this over on the wiki page: ](https://github.com/zaccolley/webres/wiki/)
3. Current Issues with the application, includes future improvements. [Find this issues over on the issues page: ](https://github.com/zaccolley/webres/issues)

All the data used for the sprint is based on live data from the University of Portsmouth's PC availability system.
Rob Calcroft created a script to collect the information, get your hands on the [raw data](http://labs.calcroft.co/pc-data.json)

# Install

To install the application onto your machine follow the following links:

1. Install InfluxDB (See the Influx DB section)
2. Run the `influx` command to create an active Influx section.
3. `create database webres`
4. `npm install`
5. `npm run update-schema`
6. `npm run db-seed`

# Test

To test the database connection and return data you should run
`npm run db-test`

# Build

If you ever update the schema you should run
`npm run update-schema`

# Run

1. `npm start`
2. go to [localhost:3000](localhost:3000) _and wait ages as we cba to cache anything ffs_

# Issues

[To find up to date issues go to the following link: ](https://github.com/zaccolley/webres/issues)

# InfluxDB

**What is InfluxDB**

Timestamp database, used timestamps as primary key instead of ID's.
**Need** to have `node-influx` v4 for it to work with InfluxDB v9.

- Install [influx v9](https://influxdb.com/docs/v0.9/introduction/installation.html)
- `influxd` to start database, `influx` to start database instance.
- Seed with [`data/seed.js`](https://github.com/zaccolley/webres/blob/master/data/seed.js)
