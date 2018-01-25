/* global it, describe */
const should = require('should');
const redditSearch = require('../src/index');

describe('Reddit Search', () => {

    describe('Testing search method', () => {
        it('should return an object', async () => {
            const obj = await redditSearch('hotels');
            obj.should.be.an.Object();
        });
    });

});
