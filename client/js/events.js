document.addEventListener("DOMContentLoaded", () => {
    const addEventButton = document.getElementById('addEventBtn');
    const eventForm = document.getElementById('eventForm');
    const eventsSection = document.getElementById('events'); 
    const upcomingEventsContainer = document.getElementById('upcomingEventsContainer');
    const previousEventsContainer = document.getElementById('previousEventsContainer');

    // show events section and form
    addEventButton.addEventListener('click', () => {
        eventsSection.style.display = 'block';  
        document.getElementById('addEventForm').style.display = 'block'; 
    });

    // add new event
    eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // get data from the form
        const newEvent = {
            title: document.getElementById('eventTitle').value,
            location: document.getElementById('eventLocation').value,
            time: document.getElementById('eventTime').value,
            capacity: document.getElementById('eventCapacity').value,
            description: document.getElementById('eventDescription').value,
            imageURL: document.getElementById('eventImageURL').value
        };

        try {
            await addEvent(newEvent);
            loadEvents(); 
            eventForm.reset();
            eventForm.style.display = 'none'; 
            document.getElementById('addEventForm').style.display = 'none';
        } catch (error) {
            console.error('Error adding event:', error);
        }
    });

    // add event function
    async function addEvent(newEvent) {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEvent)
        });

        if (!response.ok) {
            throw new Error('Failed to add event');
        }
    }

    // load events and sort into correct containers
    async function loadEvents() {
        try {
            const response = await fetch('/api/events');
            const eventList = await response.json();

            upcomingEventsContainer.innerHTML = '';
            previousEventsContainer.innerHTML = '';

            if (eventList.length === 0) {
                upcomingEventsContainer.innerHTML = '<p>No events available.</p>';
                previousEventsContainer.innerHTML = '<p>No events available.</p>';
            } else {
                const currentDate = new Date();
                for (const eventInfo of eventList) {
                    const eventResponse = await fetch(`/api/events/${eventInfo.id}`);
                    const event = await eventResponse.json();

                    const eventDate = new Date(event.time);
                    const eventCard = createEventCard(event);

                    if (eventDate >= currentDate) {
                        upcomingEventsContainer.appendChild(eventCard);
                    } else {
                        previousEventsContainer.appendChild(eventCard);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading events:', error);
            upcomingEventsContainer.innerHTML = '<p>Failed to load events.</p>';
        }
    }

    // create event card
    function createEventCard(event) {
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
        return eventCard;
    }

    loadEvents(); 
});