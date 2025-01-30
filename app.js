const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();

let events = require('./data/events.json');
let musicians = require('./data/musicians.json');
let userProfile = require('./data/user.json');

console.log("Loaded Events:", events);
console.log("Loaded Musicians:", musicians);
console.log("Loaded User Profile:", userProfile);

app.use(express.json());
app.use(express.static('client'));


//give ids to events and musicians
events.forEach(event => {
    if (!event.id) {
        event.id = uuidv4();
    }
});
fs.writeFileSync('./data/events.json', JSON.stringify(events, null, 2));

musicians.forEach(musician => {
    if (!musician.id) {
        musician.id = uuidv4();
    }
});
fs.writeFileSync('./data/musicians.json', JSON.stringify(musicians, null, 2));


// get a list of events IDs and titles
app.get("/api/events", function(req, resp) {
    let eventList = events.map(event => ({ id: event.id, title: event.title }));
    resp.send(eventList);
});

// get event details by ID
app.get("/api/events/:id", function(req, resp) {
    let event = events.find(e => e.id === req.params.id);
    event ? resp.send(event) : resp.status(404).send({ error: "Event not found" });
});

// add a new event
app.post("/api/events", function(req, resp) {
    let { title, location, time, capacity, description, imageURL } = req.body;
    if (!title || !location || !time) {
        return resp.status(400).send({ error: "Title, location, and time are required" });
    }
    let newEvent = { id: uuidv4(), title, location, time, capacity, description, imageURL };
    console.log("New Event:", newEvent);
    events.push(newEvent);
    fs.writeFileSync('./data/events.json', JSON.stringify(events, null, 2));
    resp.status(201).send({ message: "Event created successfully", event: newEvent });
});

// get a list of musicians IDs and names
app.get("/api/musicians", function(req, resp) {
    let musicianList = musicians.map(m => ({ id: m.id, name: m.name }));
    resp.send(musicianList);
});

// get musician details by ID
app.get("/api/musicians/:id", function(req, resp) {
    let musician = musicians.find(m => m.id === req.params.id);
    musician ? resp.send(musician) : resp.status(404).send({ error: "Musician not found" });
});

// add a new musician
app.post("/api/musicians", function(req, resp) {
    let { name, instruments, about, location, image } = req.body;
    if (!name || !instruments) {
        return resp.status(400).send({ error: "Name and instruments are required" });
    }
    let newMusician = { id: uuidv4(), name, instruments, about, location, image };
    console.log("New Musician:", newMusician);
    musicians.push(newMusician);
    fs.writeFileSync('./data/musicians.json', JSON.stringify(musicians, null, 2));
    resp.status(201).send({ message: "Musician added successfully", musician: newMusician });
});

// get user profile
app.get("/api/user", function(req, resp) {
    resp.send(userProfile);
});

// update user profile
app.post("/api/user", function(req, resp) {
    let { name, instruments, about, location, image } = req.body;
    if (!name) {
        return resp.status(400).send({ error: "Name is required" });
    }
    userProfile = { name, instruments, about, location, image };
    console.log("Updated User Profile:", userProfile);
    fs.writeFileSync('./data/user.json', JSON.stringify(userProfile, null, 2));
    resp.status(200).send({ message: "User profile updated successfully", user: userProfile });
});

module.exports = app;