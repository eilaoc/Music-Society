document.addEventListener("DOMContentLoaded", () => {   

    const addEventButton = document.getElementById('addEventBtn');
    //const addEventForm = document.getElementById('addEventForm');
    const eventForm = document.getElementById('eventForm');
    const upcomingEventsContainer = document.getElementById('upcomingEventsContainer');
    const previousEventsContainer = document.getElementById('previousEventsContainer');


    addEventButton.addEventListener('click', () => {
        addEventForm.style.display = 'block'; 
        eventForm.style.display = 'block'; 
    });

    //event form
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        eventForm.style.display = 'none'; 
        addEventForm.style.display = 'none'; 
        // get data from form
        const newEvent = {
            title: document.getElementById('eventTitle').value,
            location: document.getElementById('eventLocation').value,
            time: document.getElementById('eventTime').value,
            capacity: document.getElementById('eventCapacity').value,
            description: document.getElementById('eventDescription').value,
            imageURL: document.getElementById('eventImageURL').value
        };

        //handle new event
        fetch('/api/event/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newEvent)
        })
        .then(response => response.json())
        .then(() => {
          //reload events
            loadEvents(); 
            eventForm.reset();
            console.log("Hiding form:", addEventForm);
            eventForm.style.display = 'none'; 
            addEventForm.style.display = 'none'; 
            
        })
        .catch(error => console.error('Error adding event:', error));
    });

    // load events
    function loadEvents() {
        fetch('/api/events')
        .then(response => response.json())
        .then(events => {
            upcomingEventsContainer.innerHTML = ''; 
            previousEventsContainer.innerHTML = '';



            if (events.length === 0) {
                upcomingEventsContainer.innerHTML = '<p>No events available.</p>';
                previousEventsContainer.innerHTML = '<p>No events available.</p>';
            } else {
                const currentDate = new Date(); 

                events.forEach(event => {
                    const eventDate = new Date(event.time); 
                    const eventCard = document.createElement('div');
                    eventCard.classList.add('event-card', 'd-flex', 'align-items-center', 'mb-4');

                    eventCard.innerHTML = `
                        <img src="${event.imageURL}" alt="${event.title}" class="event-image" style="width: 150px; height: 150px; object-fit: cover; margin-right: 20px;">
                        <div class="event-details">
                            <h4>${event.title}</h4>
                            <p><strong>Location:</strong> ${event.location}</p>
                            <p><strong>Time:</strong> ${new Date(event.time).toLocaleString()}</p>
                            <p><strong>Capacity:</strong> ${event.capacity}</p>
                            <p><strong>Description:</strong> ${event.description}</p>
                        </div>
                    `;

                    if (eventDate >= currentDate) {
                        upcomingEventsContainer.appendChild(eventCard); 
                    } else {
                        previousEventsContainer.appendChild(eventCard);
                    }
                });

            }
        })
        .catch(error => {
            console.error('Error loading events:', error);
            upcomingEventsContainer.innerHTML = '<p>Failed to load events.</p>';
        });
    }

    // load events
    const eventsSection = document.getElementById('events');
    eventsSection.addEventListener('click', loadEvents);

    loadEvents(); 
});