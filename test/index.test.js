/* global it, describe */
const should = require('should');
const { searchReddit } = require('../lib');

describe('Reddit Search', () => {

    describe('Testing search method', () => {
        it('should return an object', async () => {
            const obj = await searchReddit('hotels');
            obj.should.be.an.Object();
        });
    });

});
