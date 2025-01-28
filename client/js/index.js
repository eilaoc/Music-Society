document.addEventListener("DOMContentLoaded", () => {
    const randomEventContainer = document.getElementById("randomEventContainer");

    //get random event
    function loadRandomEvent() {
        fetch('/api/events')
            .then(response => response.json())
            .then(events => {
                if (events.length > 0) {
                    const randomEvent = events[Math.floor(Math.random() * events.length)];

                    randomEventContainer.innerHTML = `
                        <div class="event-card d-flex align-items-center">
                            <img src="${randomEvent.imageURL}" alt="${randomEvent.title}" class="event-image" style="width: 150px; height: 150px; object-fit: cover; margin-right: 20px;">
                            <div class="event-details">
                                <h4>${randomEvent.title}</h4>
                                <p><strong>Location:</strong> ${randomEvent.location}</p>
                                <p><strong>Time:</strong> ${new Date(randomEvent.time).toLocaleString()}</p>
                                <p><strong>Capacity:</strong> ${randomEvent.capacity}</p>
                                <p><strong>Description:</strong> ${randomEvent.description}</p>
                            </div>
                        </div>
                    `;
                } else {
                    randomEventContainer.innerHTML = `<p>No upcoming events available.</p>`;
                }
            })
            .catch(error => {
                console.error('Error loading random event:', error);
                randomEventContainer.innerHTML = `<p>Failed to load event.</p>`;
            });
    }

    loadRandomEvent();
});