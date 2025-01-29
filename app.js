const express = require('express');
const fs = require('fs');

const app = express();

let events = require('./data/events.json');
let musicians = require('./data/musicians.json');
let userProfile = require('./data/user.json');

console.log("Loaded Events:", events);
console.log("Loaded Musicians:", musicians);
console.log("Loaded User Profile:", userProfile);

app.use(express.json());
app.use(express.static('client'));

// Sort events by date
function sortEventsByDate(events) {
    return events.sort((a, b) => new Date(a.time) - new Date(b.time));
}

// Get events (sorted)
app.get('/api/events', function(req, resp) {
    let sortedEvents = sortEventsByDate(events);
    resp.json(sortedEvents);
});

// Add new event
app.post('/api/event/add', function(req, resp) {
    let { title, location, time, capacity, description, imageURL } = req.body;
    let newEvent = { title, location, time, capacity, description, imageURL };
    console.log("New Event:", newEvent);
    events.push(newEvent);
    fs.writeFileSync('./data/events.json', JSON.stringify(events, null, 2));
    resp.sendStatus(200);
});

// Get musicians
app.get('/api/musicians', function(req, res) {
    res.json(musicians);
});

// Add new musician profile
app.post('/api/musician/add', function(req, resp) {
    let { name, instruments, about, location, image } = req.body;
    let newProfile = { name, instruments, about, location, image };
    console.log("New Musician:", newProfile);
    musicians.push(newProfile);
    fs.writeFileSync('./data/musicians.json', JSON.stringify(musicians, null, 2));
    resp.sendStatus(200);
});

// Get user profile
app.get('/api/user', function(req, res) {
    res.json(userProfile);
});

// Update user profile
app.post('/api/user/add', function(req, resp) {
    let { name, instruments, about, location, image } = req.body;
    userProfile = { name, instruments, about, location, image };
    console.log("Updated User Profile:", userProfile);
    fs.writeFileSync('./data/user.json', JSON.stringify(userProfile, null, 2));
    resp.sendStatus(200);
});

module.exports = app;