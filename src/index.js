const https = require('https');

exports = module.exports = function (q) {
    return new Promise((resolve, reject) => {

        const url = `https://www.reddit.com/search.json?q=${q}&sort=new?callback=?`;

        https.get(url, (res) => {

            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });
 
            res.on('end', () => {
                console.log(JSON.parse(data).explanation);
                resolve(JSON.parse(data));
            });

        }).on('error', (e) => {
            console.error(e);
            reject(e);
        });
    })
};
