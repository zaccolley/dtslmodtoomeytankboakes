# webres
a cheeky repo for the first sprint of our web research unit

you can find more write up [over on the wiki](https://github.com/zaccolley/webres/wiki/)

get your hands on the [raw data](http://labs.calcroft.co/pc-data.json)

## influx
Instead of ID as primary key, influx uses a timestamp, can be in ms or s, defined by data entry. **Need** to have `node-influx` v4 for it to work with influxdb v9.
- Install [influx v9](https://influxdb.com/docs/v0.9/introduction/installation.html)
- `influxd` to start database, `influx` to enter repl
- [influxtest.js](https://github.com/zaccolley/webres/blob/master/influxtest.js) to see example of data entry
