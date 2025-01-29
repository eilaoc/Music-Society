const request = require('supertest');
const app = require('../app'); 

describe('test the events API', () => {
    test('test that GET /api/events returns 200', () => {
        return request(app)
            .get('/api/events')
            .expect(200);
    });

    test('test that GET /api/events returns the JSON', () => {
        return request(app)
            .get('/api/events')
            .expect('Content-type', /json/);
    });

    test('POST /api/event/add adds a new event', () => {
        const newEvent = {
            title: 'new event',
            location: 'Newcastle',
            time: new Date().toISOString(),
            capacity: 100,
            description: 'new event!',
            imageURL: 'assets/images/event1.jpg'
        };

        return request(app)
            .post('/api/event/add')
            .send(newEvent)
            .expect(200)
            .then(() => {
                // test if the event is added
                return request(app)
                    .get('/api/events')
                    .then(response => {
                        const events = response.body;
                        expect(events.length).toBeGreaterThan(0);
                        const eventTitles = events.map(event => event.title);
                        expect(eventTitles).toContain(newEvent.title);
                    });
            });
    });
});

describe('test the musicians API', () => {
    test('test that GET /api/musicians returns 200', () => {
        return request(app)
            .get('/api/musicians')
            .expect(200);
    });

    test('test to check GET /api/musicians returns the JSON', () => {
        return request(app)
            .get('/api/musicians')
            .expect('Content-type', /json/);
    });

    test('test to check POST /api/musician/add adds a new profile', () => {
        const newMusician = {
            name: 'Eila OC',
            instruments: 'Guitar',
            about: 'Guitarist',
            location: 'Newcastle',
            image: 'assets/images/profile2.jpg'
        };

        return request(app)
            .post('/api/musician/add')
            .send(newMusician)
            .expect(200)
            .then(() => {
                return request(app)
                    .get('/api/musicians')
                    .then(response => {
                        const musicians = response.body;
                        expect(musicians.length).toBeGreaterThan(0);
                        const musicianNames = musicians.map(musician => musician.name);
                        expect(musicianNames).toContain(newMusician.name);
                    });
            });
    });
});

describe('test the profile API', () => {
    test('test GET /api/user returns 200', () => {
        return request(app)
            .get('/api/user')
            .expect(200);
    });

    test('test that GET /api/user returns the JSON', () => {
        return request(app)
            .get('/api/user')
            .expect('Content-type', /json/);
    });

    test('test that post /api/user/add updates the user profile', () => {
        const updatedProfile = {
            name: 'Eila',
            instruments: 'Drums',
            about: 'Drummer',
            location: 'Durham',
            image: 'assets/images/profile1.jpg'
        };

        return request(app)
            .post('/api/user/add')
            .send(updatedProfile)
            .expect(200)
            .then(() => {
                return request(app)
                    .get('/api/user')
                    .then(response => {
                        const userProfile = response.body;
                        expect(userProfile.name).toBe(updatedProfile.name);
                        expect(userProfile.instruments).toBe(updatedProfile.instruments);
                        expect(userProfile.about).toBe(updatedProfile.about);
                        expect(userProfile.location).toBe(updatedProfile.location);
                        expect(userProfile.image).toBe(updatedProfile.image);
                    });
            });
    });
});