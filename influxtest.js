var client = require("influx")({
    host : 'localhost',
    username : 'root',
    password : 'root',
    database : 'test',
    port: 8086
});
var request = require("request");

var prom = new Promise(function(resolve, reject) {
    request("http://labs.calcroft.co/pc-data.json", function(err, response, body) {
        if(err) {
            return reject(err);
        }
        if(response.statusCode === 200) {
            resolve(JSON.parse(body));
        } else {
            reject([err, response.statusCode]);
        }
    });
});

prom.then(function(data) {
    var arr = [];
    for (var a in data) {
        if (data.hasOwnProperty(a)) {
            arr.push([{
                time: a,
                value: JSON.stringify(data[a])
            }]);
        }
    }
    client.writePoints("availability", arr, {
        database: 'test',
        precision: 's'
    }, function(err, result) {
        console.log(err, result);
    });
});

prom.catch(function(val) {
    console.log(val);
});
