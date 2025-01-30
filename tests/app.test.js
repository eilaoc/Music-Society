const request = require('supertest');
const app = require('../app');
const { v4: uuidv4 } = require('uuid');

describe('Events API', () => {

    test('GET /api/events returns 200', async () => {
        await request(app).get('/api/events').expect(200);
    });

    test('GET /api/events returns JSON', async () => {
        await request(app).get('/api/events').expect('Content-Type', /json/);
    });

    test('GET /api/events/:id returns event details', async () => {
        const newEvent = {
            id: uuidv4(),
            title: 'Test Event',
            location: 'Test Location',
            time: new Date().toISOString(),
            capacity: 100,
            description: 'Test Description',
            imageURL: 'test.jpg'
        };

        const postResponse = await request(app).post('/api/events').send(newEvent);
        const eventId = postResponse.body.event.id;

        const response = await request(app).get(`/api/events/${eventId}`).expect(200);
        expect(response.body.id).toBe(eventId);
    });

    test('POST /api/events creates an event', async () => {
        const params = {
            title: 'Concert Night',
            location: 'Newcastle',
            time: new Date().toISOString(),
            capacity: 500,
            description: 'A great concert event!',
            imageURL: 'assets/images/event2.jpg'
        };

        const response = await request(app).post('/api/events').send(params).expect(200);
        expect(response.body.message).toBe('Event created successfully');
        expect(response.body.event).toHaveProperty('id');
        expect(response.body.event.title).toBe(params.title);
    });

    test('POST /api/events returns 400 for missing fields', async () => {
        const params = { location: 'Newcastle', time: new Date().toISOString() };

        const response = await request(app).post('/api/events').send(params).expect(400);
        expect(response.body.error).toBe('Title, location, and time are required');
    });
});

describe('Musicians API', () => {

    test('GET /api/musicians returns 200', async () => {
        await request(app).get('/api/musicians').expect(200);
    });

    test('GET /api/musicians returns JSON', async () => {
        await request(app).get('/api/musicians').expect('Content-Type', /json/);
    });

    test('POST /api/musicians creates a musician', async () => {
        const params = {
            name: 'Alex Smith',
            instruments: 'Bass Guitar',
            about: 'Professional bass guitarist',
            location: 'Newcastle',
            image: 'assets/images/profile1.jpg'
        };

        const response = await request(app).post('/api/musicians').send(params).expect(200);
        expect(response.body.message).toBe('Musician added successfully');
        expect(response.body.musician).toHaveProperty('id');
        expect(response.body.musician.name).toBe(params.name);
    });

    test('POST /api/musicians returns 400 for missing fields', async () => {
        const params = { instruments: 'Bass Guitar', location: 'Newcastle' };

        const response = await request(app).post('/api/musicians').send(params).expect(400);
        expect(response.body.error).toBe('Name and instruments are required');
    });

    test('GET /api/musicians/:id returns musician details', async () => {
        const newMusician = {
            id: uuidv4(),
            name: 'Test Musician',
            instruments: 'Guitar',
            about: 'Test About',
            location: 'Test Location',
            image: 'test.jpg'
        };

        const postResponse = await request(app).post('/api/musicians').send(newMusician);
        const musicianId = postResponse.body.musician.id;

        const response = await request(app).get(`/api/musicians/${musicianId}`).expect(200);
        expect(response.body.id).toBe(musicianId);
    });

    
});

describe('User Profile API', () => {

    test('GET /api/user returns 200', async () => {
        await request(app).get('/api/user').expect(200);
    });

    test('GET /api/user returns JSON', async () => {
        await request(app).get('/api/user').expect('Content-Type', /json/);
    });

    test('POST /api/user updates user profile', async () => {
        const params = {
            name: 'Eila OC',
            instruments: 'Violin',
            about: 'Classical Violinist',
            location: 'Edinburgh',
            image: 'assets/images/profile1.jpg'
        };

        const response = await request(app).post('/api/user').send(params).expect(200);
        expect(response.body.message).toBe('User profile updated successfully');
        expect(response.body.user).toMatchObject(params);
    });

    test('POST /api/user returns 400 for missing name', async () => {
        const params = { instruments: 'Violin', about: 'Classical Violinist', location: 'Edinburgh' };

        const response = await request(app).post('/api/user').send(params).expect(400);
        expect(response.body.error).toBe('Name is required');
    });
});