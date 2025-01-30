document.addEventListener("DOMContentLoaded", () => {
    const createProfileButton = document.querySelector('#createProfileBtn');
    const musiciansContainer = document.querySelector('#musiciansContainer');
    const musiciansForm = document.querySelector('#musicianForm'); 
    const myProfileContainer = document.querySelector('#myProfileContainer')

    let userProfile = null;

    musiciansContainer.classList.add('row', 'justify-content-center', 'mt-4');
    musiciansForm.style.display = 'none';

    // Fetch all events once and store them in a lookup object
    let eventLookup = {};

    async function loadEvents() {
        try {
            const response = await fetch('/api/events');
            const events = await response.json();
            eventLookup = Object.fromEntries(events.map(event => [event.id, event.title]));
        } catch (error) {
            console.error('Error loading events:', error);
        }
    }

    // Load musicians
    async function loadMusicians() {
        await loadEvents(); // Ensure events are loaded before musicians

        try {
            const response = await fetch('/api/musicians');
            const musicians = await response.json();
             
            musiciansContainer.innerHTML = ''; 
   
            for (const musician of musicians) {
                const profileResponse = await fetch(`/api/musicians/${musician.id}`);
                const fullProfile = await profileResponse.json();
                
                if (fullProfile.isUserProfile) {
                    userProfile = fullProfile;
                } else {
                    const profileElement = await createProfileElement(fullProfile);
                    musiciansContainer.appendChild(profileElement);
                }
            }
   
            // Get user profile
            const profileResponse = await fetch('/api/user');
            const profile = await profileResponse.json();
   
            if (profile && Object.keys(profile).length > 0) {
                userProfile = profile;
                const userProfileElement = await createProfileElement(userProfile);
                myProfileContainer.appendChild(userProfileElement);
                createProfileButton.textContent = 'Edit Profile';
            } else {
                createProfileButton.textContent = 'Create Profile';
            }
        } catch (error) {
            console.error('Error loading musicians:', error);
        }
    }

    // Create profile element
    async function createProfileElement(profile) {
        const profileCard = document.createElement('div');
        profileCard.classList.add('col-md-3', 'card', 'profile-card');

        // Convert liked event IDs to event titles
        const likedEventsTitles = (profile.likedEvents || []).map(id => eventLookup[id] || "Unknown Event").join(", ") || "None";

        profileCard.innerHTML = `
            <img src="${profile.image}" alt="${profile.name}" class="card-img-top" style="height: 150px; object-fit: cover;">
            <div class="card-body">
                <h5 class="card-title">${profile.name}</h5>
                <p><strong>Instrument(s):</strong> ${profile.instruments}</p>
                <p><strong>Location:</strong> ${profile.location}</p>
                <p>${profile.about}</p>
                <p><strong>Liked Events:</strong> ${likedEventsTitles}</p>
            </div>
        `;
        return profileCard;
    }


            // Show profile form
        function showProfileForm(profile = null) {
            musiciansForm.style.display = 'block';
            createProfileButton.style.display = 'none'; 

            if (profile) {
                document.getElementById('musicianName').value = profile?.name || '';
                document.getElementById('musicianInstruments').value = profile?.instruments || '';
                document.getElementById('musicianAbout').value = profile?.about || '';
                document.getElementById('musicianLocation').value = profile?.location || '';
                document.getElementById('musicianImage').value = profile?.image || '';
            }

            // Remove previous event listener to prevent duplicates
            const form = document.getElementById('musicianForm');
            form.removeEventListener('submit', handleFormSubmit);
            form.addEventListener('submit', handleFormSubmit);
        }

        // Handle form submission
        async function handleFormSubmit(e) {
            e.preventDefault();

            const updatedProfile = {
                name: document.getElementById('musicianName').value,
                instruments: document.getElementById('musicianInstruments').value,
                about: document.getElementById('musicianAbout').value,
                location: document.getElementById('musicianLocation').value,
                image: document.getElementById('musicianImage').value,
            };

            try {
                await saveProfile(updatedProfile);

                // Update userProfile with the latest data
                userProfile = updatedProfile;

                createProfileButton.textContent = 'Edit Profile';
                createProfileButton.style.display = 'block';

                myProfileContainer.innerHTML = '';
                myProfileContainer.appendChild(await createProfileElement(updatedProfile));

                musiciansForm.style.display = 'none';
            } catch (error) {
                console.error('Error saving profile:', error);
            }
        }

    // Save profile
    async function saveProfile(profile) {
        const response = await fetch('/api/user', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profile),
        });

        if (!response.ok) {
            throw new Error('Failed to save profile');
        }
    }

    // Show form
    createProfileButton.addEventListener('click', () => {
        showProfileForm(userProfile);
    });

    loadMusicians();
});