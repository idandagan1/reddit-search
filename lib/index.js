'use strict';

var _express = require('express');

var _perf_hooks = require('perf_hooks');

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _redisMock = require('redis-mock');

var _redisMock2 = _interopRequireDefault(_redisMock);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isProd = process.env.DEV !== 'true';
var client = void 0;

if (isProd) {
    client = _redis2.default.createClient({
        host: process.env.REDIS_URL,
        port: process.env.REDIS_PORT
    });
} else {
    client = _redisMock2.default.createClient();
}

var router = (0, _express.Router)();

client.auth(process.env.REDIS_PASS, function (err) {
    if (err) throw err;
});

client.on('connect', function () {
    console.log('connected to redis sucessfully');
});

exports = module.exports = router;

router.get('/', handleQuery);

async function handleQuery(req, res, next) {

    var result = void 0;
    var q = req.query.q;


    if (!q) {
        return res.status(400).send({ msg: 'query is mandatory' });
    }
    try {
        _perf_hooks.performance.mark('start');

        // get reddit search
        var cache_q = await getCache(q);

        if (!cache_q) {
            console.log('cache: miss');
            result = await searchReddit(q);
            setCache(q, JSON.stringify(result));
        } else {
            console.log('cache: hit');
            result = JSON.parse(cache_q);
        }

        // Measure perfornace
        _perf_hooks.performance.mark('end');
        _perf_hooks.performance.measure('searchReddit', 'start', 'end');
        var measure = _perf_hooks.performance.getEntriesByName('searchReddit')[0];
        _perf_hooks.performance.clearMeasures();
        // Send response
        return res.status(200).send({ time: measure.duration, result: result });
    } catch (e) {
        next(e);
    }
}

function getCache(key) {
    return new Promise(function (resolve, reject) {
        client.get(key, function (err, val) {
            return err ? reejct(err) : resolve(val);
        });
    });
}

function setCache(key, val) {
    return new Promise(function (resolve, reject) {
        client.set(key, val, function (err, val) {
            return err ? reejct(err) : resolve(val);
        });
    });
}

function searchReddit(q) {
    return new Promise(function (resolve, reject) {

        var url = 'https://www.reddit.com/search.json?q=' + q + '&sort=new?callback=?';

        _https2.default.get(url, function (res) {

            var data = '';

            res.on('data', function (chunk) {
                data += chunk;
            });

            res.on('end', function () {
                resolve(JSON.parse(data));
            });
        }).on('error', function (e) {
            reject(e);
        });
    });
}

exports.searchReddit = searchReddit;

client.on('error', function (err) {
    console.log('Error ' + err);
});

client.on('data', function () {
    console.log('redis connected..');
});