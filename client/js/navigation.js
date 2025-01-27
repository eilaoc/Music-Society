document.addEventListener("DOMContentLoaded", () => {
    // toggle table of contents
    const tocButton = document.getElementById("table-of-contents-btn");
    const toc = document.getElementById("table-of-contents");
  
    tocButton.addEventListener("click", () => {
      toc.style.display = toc.style.display === "none" ? "block" : "none";
    });
  
    // show/hide sections
    document.body.addEventListener("click", (e) => {
      const target = e.target;

      
      if (target.hasAttribute("data-target")) {
          e.preventDefault();
          const targetId = target.getAttribute("data-target");

          // hide
          document.querySelectorAll(".section").forEach(section => {
              section.style.display = "none";  
          });

          // show
          const targetSection = document.getElementById(targetId);
          if (targetSection) {
              targetSection.style.display = "block";  
          }
      }
  });


    
    // addevent form
    const addEventButton = document.getElementById('addEventBtn');
    const addEventForm = document.getElementById('addEventForm');
    const eventForm = document.getElementById('eventForm');
    const eventsContainer = document.getElementById('eventsContainer');

    addEventButton.addEventListener('click', () => {
        addEventForm.style.display = 'block'; 
    });

    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();

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
            addEventForm.reset(); 
            addEventForm.style.display = 'none'; 
        })
        .catch(error => console.error('Error adding event:', error));
    });

    // load events
    function loadEvents() {
        fetch('/api/events')
        .then(response => response.json())
        .then(events => {
            eventsContainer.innerHTML = ''; 

            if (events.length === 0) {
                eventsContainer.innerHTML = '<p>No events available.</p>';
            } else {
                events.forEach(event => {
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
                    eventsContainer.appendChild(eventCard);
                });
            }
        })
        .catch(error => {
            console.error('Error loading events:', error);
            eventsContainer.innerHTML = '<p>Failed to load events.</p>';
        });
    }

    // load events
    const eventsSection = document.getElementById('events');
    eventsSection.addEventListener('click', loadEvents);

    loadEvents(); 
});