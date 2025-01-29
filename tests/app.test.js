const request = require('supertest');
const app = require('../app');

describe('test the events API', () => {

    test('test GET /api/events returns 200', () => {
        return request(app)
            .get('/api/events')
            .expect(200);
    });

    test('test GET /api/events returns the JSON', () => {
        return request(app)
            .get('/api/events')
            .expect('Content-Type', /json/);
    });

    test('test that POST /api/event/add works', () => {
        const params = {
            title: 'Concert Night',
            location: 'Newcastle',
            time: new Date().toISOString(),
            capacity: 500,
            description: 'A great concert event!',
            imageURL: 'assets/images/event2.jpg'
        };
        return request(app)
            .post('/api/event/add')
            .send(params)
            .expect(200);
    });

});

describe('test the musicians API', () => {

    test('test GET /api/musicians returns 200', () => {
        return request(app)
            .get('/api/musicians')
            .expect(200);
    });

    test('test GET /api/musicians returns correct JSON', () => {
        return request(app)
            .get('/api/musicians')
            .expect('Content-Type', /json/);
    });

    test('test POST /api/musician/add works', () => {
        const params = {
            name: 'Alex Smith',
            instruments: 'Bass Guitar',
            about: 'Professional bass guitarist',
            location: 'Newcastle',
            image: 'assets/images/profile1.jpg'
        };
        return request(app)
            .post('/api/musician/add')
            .send(params)
            .expect(200);
    });

});

describe('test the user profile API', () => {

    test('test GET /api/user returns 200', () => {
        return request(app)
            .get('/api/user')
            .expect(200);
    });

    test('test that GET /api/user returns the JSON', () => {
        return request(app)
            .get('/api/user')
            .expect('Content-Type', /json/);
    });

    test('test that POST /api/user/add works', () => {
        const params = {
            name: 'Eila OC',
            instruments: 'Violin',
            about: 'Classical Violinist',
            location: 'Edinburgh',
            image: 'assets/images/profile1'
        };
        return request(app)
            .post('/api/user/add')
            .send(params)
            .expect(200);
    });

});