# WEBRES - Sprint 1 - Data Visualization Sprint

This repo contains the following information:

1. Our code for the sprint.
2. Wiki containing all of our documents and findings throughout the sprint. [ Find this over on the wiki page: ](https://github.com/zaccolley/webres/wiki/)
3. Current Issues with the application, includes future improvements. [Find this issues over on the issues page: ](https://github.com/zaccolley/webres/issues)

All the data used for the sprint is based on live data from the University of Portsmouth's PC availability system.
Rob Calcroft created a script to collect the information, get your hands on the [raw data](http://labs.calcroft.co/pc-data.json)

# Install

To install the application onto your machine follow the following links:

1. [Install and Run CouchDB](https://wiki.apache.org/couchdb/Installation)
2. (Optional) Add .env values (see .env-sample)
3. `npm install`
4. `npm run update-schema`
5. `npm run db-seed` (This will take forever sorry...)

_Using eslint, would recommemd installing the `linter-eslint` package from Atom. `apm install linter-eslint`_

# Build

If you ever update the schema you should run
`npm run update-schema`

# Run

1. `npm start`
2. Go to [localhost:3000/#/ul](localhost:3000/#/ul) for the Library view
3. Use the nav or map links to browse arooound

# Test

To test the database connection and return data you should run
`npm run db-test`

You can also check CouchDB at: [http://127.0.0.1:5984/_utils](http://127.0.0.1:5984/_utils)

# Issues

[To find up to date issues go to the following link: ](https://github.com/zaccolley/webres/issues)
