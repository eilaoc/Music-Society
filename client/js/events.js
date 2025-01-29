document.addEventListener("DOMContentLoaded", () => {
    const addEventButton = document.getElementById('addEventBtn');
    const eventForm = document.getElementById('eventForm');
    const upcomingEventsContainer = document.getElementById('upcomingEventsContainer');
    const previousEventsContainer = document.getElementById('previousEventsContainer');

    // show form
    addEventButton.addEventListener('click', () => {
        eventForm.style.display = 'block'; 
    });

    // add new event
    eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // get data
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
        } catch (error) {
            console.error('Error adding event:', error);
        }
    });

    // add event
    async function addEvent(newEvent) {
        const response = await fetch('/api/event/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEvent)
        });

        if (!response.ok) {
            throw new Error('Failed to add event');
        }
    }

    // load events
    async function loadEvents() {
        try {
            const response = await fetch('/api/events');
            const events = await response.json();

            upcomingEventsContainer.innerHTML = '';
            previousEventsContainer.innerHTML = '';

            if (events.length === 0) {
                upcomingEventsContainer.innerHTML = '<p>No events available.</p>';
                previousEventsContainer.innerHTML = '<p>No events available.</p>';
            } else {
                const currentDate = new Date();
                events.forEach(event => {
                    const eventDate = new Date(event.time);
                    const eventCard = createEventCard(event);

                    if (eventDate >= currentDate) {
                        upcomingEventsContainer.appendChild(eventCard);
                    } else {
                        previousEventsContainer.appendChild(eventCard);
                    }
                });
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