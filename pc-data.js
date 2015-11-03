#!/usr/bin/env node

var fs = require("fs"),
    request = require("request"),
    accessToken = process.env.SSDTOKEN;

if(!accessToken) {
    throw new Error("No token, run: export SSDTOKEN=*");
}

request("http://ssd.api.port.ac.uk/v1/buildings/openaccess?access_token=" + accessToken, function(err, response, body) {
    if(err || response.statusCode !== 200) {
        return addToDb({
            error: err,
            statusCode: response.statusCode
        });
    }
    addToDb(body);
});

function addToDb(responseBody) {
    var pcData = require("./pc-data.json");
    pcData[Math.round(Date.now()/1000)] = responseBody;
    fs.writeFileSync("pc-data.json", JSON.stringify(pcData));
}
