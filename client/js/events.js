document.addEventListener("DOMContentLoaded", () => {
    const addEventButton = document.getElementById('addEventBtn');
    const eventForm = document.getElementById('eventForm');
    const eventsSection = document.getElementById('events');
    const addEventForm = document.getElementById('addEventForm');
    const upcomingEventsContainer = document.getElementById('upcomingEventsContainer');
    const previousEventsContainer = document.getElementById('previousEventsContainer');

    // Show events section and form when 'Add Event' is clicked
    addEventButton.addEventListener('click', () => {
        eventsSection.style.display = 'block';  // Make sure the events section is visible
        addEventForm.style.display = 'block';  // Show the form to add a new event
    });

    // Add new event
    eventForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get data from the form
        const newEvent = {
            title: document.getElementById('eventTitle').value,
            location: document.getElementById('eventLocation').value,
            time: document.getElementById('eventTime').value,
            capacity: document.getElementById('eventCapacity').value,
            description: document.getElementById('eventDescription').value,
            imageURL: document.getElementById('eventImageURL').value
        };

        try {
            // Add the event to the backend
            await addEvent(newEvent);
            // Load and display the updated events
            loadEvents();
            // Reset the form and hide it again
            eventForm.reset();
            addEventForm.style.display = 'none'; // Hide the form
        } catch (error) {
            console.error('Error adding event:', error);
        }
    });

    // Add event function
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

    // Load events and sort them into the correct containers
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

    // Create event card
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