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

    test('test POST /api/events works with valid data', () => {
        const params = {
            title: 'Concert Night',
            location: 'Newcastle',
            time: new Date().toISOString(),
            capacity: 500,
            description: 'A great concert event!',
            imageURL: 'assets/images/event2.jpg'
        };
        return request(app)
            .post('/api/events')
            .send(params)
            .expect(200)  
            .expect((response) => {
                expect(response.body.message).toBe('Event created successfully');
                expect(response.body.event).toHaveProperty('id');
                expect(response.body.event.title).toBe(params.title);
            });
    });

    test('test POST /api/events returns 400 for missing required fields', () => {
        const params = {
            location: 'Newcastle',
            time: new Date().toISOString(),
        };
        return request(app)
            .post('/api/events')
            .send(params)
            .expect(400)  
            .expect((response) => {
                expect(response.body.error).toBe('Title, location, and time are required');
            });
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

    test('test POST /api/musicians works with valid data', () => {
        const params = {
            name: 'Alex Smith',
            instruments: 'Bass Guitar',
            about: 'Professional bass guitarist',
            location: 'Newcastle',
            image: 'assets/images/profile1.jpg'
        };
        return request(app)
            .post('/api/musicians')
            .send(params)
            .expect(200)  
            .expect((response) => {
                expect(response.body.message).toBe('Musician added successfully');
                expect(response.body.musician).toHaveProperty('id');
                expect(response.body.musician.name).toBe(params.name);
            });
    });

    test('test POST /api/musicians returns 400 for missing required fields', () => {
        const params = {
            instruments: 'Bass Guitar',
            location: 'Newcastle',
        };
        return request(app)
            .post('/api/musicians')
            .send(params)
            .expect(400)  
            .expect((response) => {
                expect(response.body.error).toBe('Name and instruments are required');
            });
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

    test('test POST /api/user works with valid data', () => {
        const params = {
            name: 'Eila OC',
            instruments: 'Violin',
            about: 'Classical Violinist',
            location: 'Edinburgh',
            image: 'assets/images/profile1.jpg'
        };
        return request(app)
            .post('/api/user')
            .send(params)
            .expect(200)  
            .expect((response) => {
                expect(response.body.message).toBe('User profile updated successfully');
                expect(response.body.user).toHaveProperty('name', params.name);
                expect(response.body.user).toHaveProperty('instruments', params.instruments);
            });
    });

    test('test POST /api/user returns 400 for missing required fields', () => {
        const params = {
            instruments: 'Violin',
            about: 'Classical Violinist',
            location: 'Edinburgh',
        };
        return request(app)
            .post('/api/user')
            .send(params)
            .expect(400)  
            .expect((response) => {
                expect(response.body.error).toBe('Name is required');
            });
    });

});