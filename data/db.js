export const options = {
    host : 'localhost',
    username : 'root',
    password : 'root',
    database : 'webres',
    port: 8086
};

export const client = require('influx')(options);
