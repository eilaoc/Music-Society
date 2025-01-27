const express = require('express');
const fs = require('fs');

const app = express();

// load events
let events = require('./data/events.json');

app.use(express.json()); 
app.use(express.static('client')); 

//sort the events
function sortEventsByDate(events) {
    return events.sort((a, b) => {
        const dateA = new Date(a.time);  
        const dateB = new Date(b.time); 
        return dateA - dateB;  
    });
}

// get events
app.get('/api/events', (req, resp) => {
    const sortedEvents = sortEventsByDate(events);  
    resp.json(sortedEvents); 
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