const request = require('request');
const assert = require('assert');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const data = require('../data');

const serviceUrl = 'http://127.0.0.1:3000';

describe('CRUD', function () {
    // before(function (done) {
    //     data.clear();
    //     done();
    // });

    it('POST /companies returns all the companies', function (done) {
        const req = {};
        
        axios({
            url: `${serviceUrl}/companies`,
            method: 'POST',
            data: req
        })
        .then((response) => {
            assert.strictEqual(response.status, 200);
        })
        .catch((err) => {
            return console.log(err);
        })
        .finally(() => {
            done();
        })
    });

    it('POST /companies should not allow an invalid query', function (done) {
        const req = {name: 'Aaron Escape Rooms - Atlanta' };
        axios({
            url: `${serviceUrl}/companies`,
            method: 'POST',
            data: req
        })
            .catch((err) => {
                assert.strictEqual(err.response.status, 404);
                assert.strictEqual(err.response.data.error, 'There are no results that match your query.')
            })
            .finally(() => {
                done();
            })
    });

    it('POST /rooms should not allow an invalid query', function (done) {
        const req = { name: 'Aaron Escape Rooms - Atlanta' };
        axios({
            url: `${serviceUrl}/rooms`,
            method: 'POST',
            data: req
        })
            .catch((err) => {
                assert.strictEqual(err.response.status, 404);
                assert.strictEqual(err.response.data.error, 'There are no results that match your query.')
            })
            .finally(() => {
                done();
            })
    });

    it('POST /rooms should return some rooms', function (done) {
        const req = { fields: ['nothing', 'everything'] };
        axios({
            url: `${serviceUrl}/rooms`,
            method: 'POST',
            data: req
        })
            .then((response) => {
                console.log(response.data);
            })
            .catch((err) => {
                console.log(err.response.data.error)
                // console.log(err);
                // assert.strictEqual(err.response.status, 404);
                // assert.strictEqual(err.response.data.error, 'There are no results that match your query.')
            })
            .finally(() => {
                done();
            })
    });

    it('POST /add/rooms should successfully create a room', (done) => {
        const room1 = {
            themes: ['scary', 'zombie', 'time machine'],
            age_requirement: 34,
            average_rating: 4,
            description: 'A great room',
            difficulty: 4,
            fear_level: 5,
        }
        const room2 = {
            themes: ['scary', 'zombie', 'time machine'],
            age_requirement: 34,
            average_rating: 4,
            description: 'A great room',
            difficulty: 4,
            fear_level: 5,
        }

        request.post(`${serviceUrl}/add/rooms`, { json: room1 }, (err, res, body) => {
            done();
        });
    });

    it('POST /add/company should successfully create a company', (done) => {
        const company = {
            franchises: ['5d1b9c562bb2d3f741a276f7'],
            locations: ['5d1b9c562bb2d3f741a276f7'],
            name: 'Red Door Escape',
            rooms: ['5d1b9c562bb2d3f741a276f7'],
            slug: 'red-door-escape',
            website: 'https://www.reddoorescape.com/',
        }
        const company2 = {
            franchises: ['5d1b9c562bb2d3f741a276f7'],
            locations: ['5d1b9c562bb2d3f741a276f7'],
            name: 'Red Door Escape',
            rooms: ['5d1b9c562bb2d3f741a276f7'],
            slug: 'red-door-escape',
            website: 'https://www.reddoorescape.com/',
        }
        const company3 = {
            franchises: ['5d1b9c562bb2d3f741a276f7'],
            locations: ['5d1b9c562bb2d3f741a276f7'],
            name: 'Red Door Escape',
            rooms: ['5d1b9c562bb2d3f741a276f7'],
            slug: 'red-door-escape',
            website: 'https://www.reddoorescape.com/',
        }

        request.post('http://127.0.0.1:3000/add/companies', { json: company }, (err, res, body) => {
            assert.ifError(err);
        });
        request.post('http://127.0.0.1:3000/add/companies', { json: company2 }, (err, res, body) => {
            assert.ifError(err);
        });
        request.post('http://127.0.0.1:3000/add/companies', { json: company3 }, (err, res, body) => {
            assert.ifError(err);
            done()
        });
    });

    it('POST /add/companies should do stuff', function (done) {
        const req = {thing: 'stuff'};

        request.post(`${serviceUrl}/add/companies/${process.env.ADMIN_ID}`, { json: req }, function (err, res, body) {
            // assert.equal(res.statusCode, 200);
            // assert.equal(body.length, 0);
            // console.log(body);
            done();
        });
    });

    it('GET /partners should return one partner', function (done) {
        const partner = {
            name: 'Walmart',
            roles: ['Vendor']
        };

        request.post(`${serviceUrl}/partners`, { json: partner }, function (err) {
            assert.ifError(err);

            request.get(`${serviceUrl}/partners`, { json: true }, function (err, res, body) {
                assert.ifError(err);
                assert.equal(res.statusCode, 200);
                assert.equal(body.length, 1);
                done();
            });
        });
    });

    it('GET /partners/:id should return a 404 for an unknown ID', function (done) {
        request.get(`${serviceUrl}/partners/5ce6b153df53b69892a01b3f`, { json: true }, function (err, res) {
            assert.ifError(err);
            assert.equal(res.statusCode, 404);
            done();
        });
    });

    it('GET /partners/:id returns a partner', function (done) {
        const partner = {
            name: 'Walmart',
            roles: ['Vendor']
        };

        request.post(`${serviceUrl}/partners`, { json: partner }, function (err, res, partner) {
            assert.ifError(err);

            request.get(`${serviceUrl}/partners/${partner.id}`, { json: partner }, function (err, res) {
                assert.ifError(err);
                assert.strictEqual(res.statusCode, 200);
                done();
            });
        });
    });

    it('PUT /partners/:id updates editable fields on a partner', function (done) {
        const partner = {
            name: 'Walmart',
            roles: ['Vendor']
        };

        request.post(`${serviceUrl}/partners`, { json: partner }, function (err, res, partner) {
            assert.ifError(err);

            const update = {
                'name': 'Target',
                'accounts': ['5ce6c4495839d39a8c149eb4'],
                'roles': ['Affiliate', 'Vendor']
            };

            request.put(`${serviceUrl}/partners/${partner.id}`, { json: update }, function (err, res, body) {
                assert.ifError(err);
                assert.equal(res.statusCode, 200);
                assert.equal(body.name, update.name);
                assert.equal(body.accounts.toString(), update.accounts.toString());
                assert.equal(body.roles.toString(), update.roles.toString());

                request.get(`${serviceUrl}/partners/${partner.id}`, { json: partner }, function (err, res, body) {
                    assert.ifError(err);
                    assert.equal(res.statusCode, 200);
                    assert.equal(body.name, update.name);
                    assert.equal(body.accounts.toString(), update.accounts.toString());
                    assert.equal(body.roles.toString(), update.roles.toString());
                    done();
                });
            });
        });
    });

    it('PUT /partners/:id should return a 404 for an unknown ID', function (done) {
        const update = {
            'accounts': ['5ce6c4495839d39a8c149eb4'],
            'name': 'Target',
            'roles': ['Affiliate', 'Vendor']
        };

        request.put(`${serviceUrl}/partners/507c7f79bcf86cd7994f6c0e`, { json: update }, function (err, res) {
            assert.equal(res.statusCode, 404);
            done();
        });
    });

    it('DELETE /partners/:id should delete a partner', function (done) {
        const partner = {
            name: 'Walmart',
            roles: ['Vendor']
        };

        request.post(`${serviceUrl}/partners`, { json: partner }, function (err, res, partner) {
            assert.ifError(err);

            request.del(`${serviceUrl}/partners/${partner.id}`, { json: partner }, function (err, res) {
                assert.ifError(err);
                assert.equal(res.statusCode, 204);

                request.get(`${serviceUrl}/partners/${partner.id}`, { json: true }, function (err, res) {
                    assert.ifError(err);
                    assert.equal(res.statusCode, 404);
                    done();
                });
            });
        });
    });

    it('DELETE /partners/:id should return a 404 for an unknown ID', function (done) {
        request.del(`${serviceUrl}/partners/507c7f79bcf86cd7994f6c0e`, { json: true }, function (err, res) {
            assert.ifError(err);
            assert.equal(res.statusCode, 404);
            done();
        });
    });
});