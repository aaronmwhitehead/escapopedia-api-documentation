const request = require('request');
const assert = require('assert');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

// const data = require('../data');

// const serviceUrl = 'http://127.0.0.1:3000';
const serviceUrl = 'https://escapopedia.herokuapp.com';

describe.only('COMPANIES', function(done) {
    // this.timeout(20000);
    describe('request', () => {
        
        it.only('POST /companies returns all the companies', (done) => {
            const req = {
                'fields': [],
                'query': {},
                'offset': 0,
                'limit': 1
            };

            // request.post(`${serviceUrl}/companies`, {json: req}, (err, res) => {
            //     console.log(res);
            //     done();
            // });

            axios({
                url: `${serviceUrl}/franchises`,
                method: 'POST',
                data: req
            }).then((response) => {
                console.log(JSON.stringify(response.data, null, 4));
                assert.strictEqual(response.status, 200);
                done();
            });
        });

        it('POST /companies with valid body', (done) => {
            const req = {
                fields: ['name', 'locations'],
                query: { name: 'Red Door Escape Room' },
                limit: 5, 
                offset: 0
            };

            axios({
                url: `${serviceUrl}/companies`,
                method: 'POST',
                data: req
            }).then((response) => {
                assert.strictEqual(response.status, 200);
                done();
            })
        });

        it('POST /companies with invalid body', (done) => {
            const req = {
                fields: ['name', 'locations'],
                queries: { name: 'Red Door Escape Room' },
                lemons: 5,
                officer: 0
            };

            axios({
                url: `${serviceUrl}/companies`,
                method: 'POST',
                data: req
            }).catch((err) => {
                assert.strictEqual(err.response.status, 400);
                assert.strictEqual(err.response.data, `Company has no attribute 'queries'`);
            }).finally(() => {
                done();
            });
        });
    });
    
    describe('FIELDS', () => {
        it('POST /companies with valid fields', (done) => {
            const req = {
                fields: ['name'],
            };

            axios({
                url: `${serviceUrl}/companies`,
                method: 'POST',
                data: req
            }).then((response) => {
                assert.strictEqual(response.data[0].locations, undefined);
                assert.strictEqual(response.status, 200);
            }).finally(() => {
                done();
            })
        });

        it('POST /companies with invalid fields', (done) => {
            const req = {
                fields: ['all'],
            };

            axios({
                url: `${serviceUrl}/companies`,
                method: 'POST',
                data: req
            }).catch((err) => {
                assert.strictEqual(err.response.status, 400);
                assert.strictEqual(err.response.data.error, `No matching fields for '${req.fields[0]}'`);
            }).finally(() => {
                done();
            });
        });

        it('POST /companies with empty fields', (done) => {
            const req = {
                fields: [],
            };

            axios({
                url: `${serviceUrl}/companies`,
                method: 'POST',
                data: req
            }).then((response) => {
                assert.strictEqual(response.status, 200);
            }).finally(() => {
                done();
            })
        });
    });
    
    describe('QUERY', () => {
        it('POST /companies with valid query', () => {

        });

        it('POST /companies with invalid query', () => {

        });

        it('POST /companies with empty query', () => {

        });
    });

    describe('LIMIT', () => {
        it('POST /companies with valid limit', () => {

        });

        it('POST /companies with invalid limit', () => {

        });

        it('POST /companies with empty limit', () => {

        });
    });

    describe('OFFSET', () => {
        it('POST /companies with valid offset', () => {

        });

        it('POST /companies with invalid offset', () => {

        });

        it('POST /companies with empty offset', () => {

        });
    })
})
