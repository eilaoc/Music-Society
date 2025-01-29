document.addEventListener("DOMContentLoaded", () => {
    const randomEventContainer = document.getElementById("randomEventContainer");
    const recentMembersContainer = document.getElementById('recentMembersContainer'); 

    // load random event
    async function loadRandomEvent() {
        try {
            const response = await fetch('/api/events');
            const events = await response.json();

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
        } catch (error) {
            console.error('Error loading random event:', error);
            randomEventContainer.innerHTML = `<p>Failed to load event.</p>`;
        }
    }

    // load musicians
    async function loadRecentMembers() {
        try {
            const response = await fetch('/api/musicians');
            const musicians = await response.json();

            if (musicians.length > 0) {
                const randomProfiles = musicians.sort(() => 0.5 - Math.random()).slice(0, 2);

                recentMembersContainer.innerHTML = ''; 

                const profilesRow = document.createElement('div');
                profilesRow.classList.add('row', 'justify-content-center', 'mt-3');

                randomProfiles.forEach(profile => {
                    const profileCard = document.createElement('div');
                    profileCard.classList.add('col-md-4', 'col-lg-3', 'col-lg-3', 'card', 'profile-card');

                    profileCard.innerHTML = `
                        <img src="${profile.image}" alt="${profile.name}" class="card-img-top" style="height: 150px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${profile.name}</h5>
                            <p><strong>Instrument(s):</strong> ${profile.instruments}</p>
                            <p><strong>Location:</strong> ${profile.location}</p>
                            <p>${profile.about}</p>
                        </div>
                    `;
                    profilesRow.appendChild(profileCard);
                });

                recentMembersContainer.appendChild(profilesRow);
            } else {
                recentMembersContainer.innerHTML = `<p>No musicians available.</p>`;
            }
        } catch (error) {
            console.error('Error loading recent members:', error);
            recentMembersContainer.innerHTML = `<p>Failed to load recent members.</p>`;
        }
    }


    loadRandomEvent();
    loadRecentMembers();
});