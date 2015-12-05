# WEBRES - Sprint 1 - Data Visualization Sprint

This repo contains the following information:

1. Our code for the sprint.
2. Wiki containing all of our documents and findings throughout the sprint. [ Find this over on the wiki page: ](https://github.com/zaccolley/webres/wiki/)
3. Current Issues with the application, includes future improvements. [Find this issues over on the issues page: ](https://github.com/zaccolley/webres/issues)

All the data used for the sprint is based on live data from the University of Portsmouth's PC availability system.
Rob Calcroft created a script to collect the information, get your hands on the [raw data](http://labs.calcroft.co/pc-data.json)

# Install

To install the application onto your machine follow the following links:

1. [Install CouchDB](https://wiki.apache.org/couchdb/Installation)
2. (Optional) Add .env values (see .env-sample)
3. `npm install`
4. `npm run update-schema`
5. `npm run db-seed`

_Using eslint, would recommemd installing the `linter-eslint` package from Atom. `apm install linter-eslint`_

# Test

To test the database connection and return data you should run
`npm run db-test`

# Build

If you ever update the schema you should run
`npm run update-schema`

# Run

1. `npm start`
2. Go to [localhost:3000](localhost:3000)

# Issues

[To find up to date issues go to the following link: ](https://github.com/zaccolley/webres/issues)
