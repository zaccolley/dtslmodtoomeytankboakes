# webres
a cheeky repo for the first sprint of our web research unit

you can find more write up [over on the wiki](https://github.com/zaccolley/webres/wiki/)

get your hands on the [raw data](http://labs.calcroft.co/pc-data.json)

# install

1. install influxdb (see below)
2. `influx`
3. `create database webres`
4. `npm install`
5. `npm run update-schema`
6. `npm run db-seed`

_you can run `npm run db-test` to check the db is working_

# build

if you update the schema you should run
`npm run update-schema`

# run

1. `npm start`
2. go to [localhost:3000](localhost:3000) _and wait ffs_

## influxb
Instead of ID as primary key, influx uses a timestamp, can be in ms or s, defined by data entry. **Need** to have `node-influx` v4 for it to work with influxdb v9.
- Install [influx v9](https://influxdb.com/docs/v0.9/introduction/installation.html)
- `influxd` to start database, `influx` to enter repl
- Seed with [`data/seed.js`](https://github.com/zaccolley/webres/blob/master/data/seed.js)
