const express = require('express');
const fs = require('fs');

const app = express();

// load events
let events = require('./data/events.json');

app.use(express.json()); 
app.use(express.static('client')); 


app.get('/api/event/rand', (req, resp) => {
    let index = Math.floor(Math.random() * events.length);
    resp.send(events[index]);
});

// get events
app.get('/api/events', (req, resp) => {
    resp.json(events); 
});

// add new event
app.post('/api/event/add', (req, resp) => {
    const { title, location, time, capacity, description, imageURL } = req.body;
    const newEvent = { title, location, time, capacity, description, imageURL };

    events.push(newEvent);

    const eventsText = JSON.stringify(events, null, 2); 
    fs.writeFileSync('./data/events.json', eventsText);

    resp.sendStatus(200); 
});

module.exports = app;