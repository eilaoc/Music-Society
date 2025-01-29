document.addEventListener("DOMContentLoaded", () => {
    const createProfileButton = document.querySelector('#musicians .btn');
    const musiciansContainer = document.createElement('div');
    const musiciansForm = document.querySelector('#musicianForm'); 
    let userProfile = null;

    musiciansContainer.classList.add('row', 'justify-content-center', 'mt-4');
    musiciansForm.style.display = 'none';

    createProfileButton.parentNode.insertAdjacentElement('afterend', musiciansContainer);

    // load musicians
    async function loadMusicians() {
        try {
            const response = await fetch('/api/musicians');
            const musicians = await response.json();
            musiciansContainer.innerHTML = ''; 

            musicians.forEach(musician => {
                if (musician.isUserProfile) {
                    userProfile = musician;
                } else {
                    const profileElement = createProfileElement(musician);
                    musiciansContainer.appendChild(profileElement);
                }
            });

            // get user profile
            const profileResponse = await fetch('/api/user');
            const profile = await profileResponse.json();

            if (profile && Object.keys(profile).length > 0) {
                userProfile = profile;
                const myProfileDiv = document.createElement('div');
                myProfileDiv.id = 'myProfile';
                myProfileDiv.classList.add('row', 'justify-content-center');
                myProfileDiv.appendChild(createProfileElement(userProfile));
                createProfileButton.parentNode.insertAdjacentElement('beforebegin', myProfileDiv);
                createProfileButton.textContent = 'Edit Profile';
            } else {
                createProfileButton.textContent = 'Create Profile';
            }
        } catch (error) {
            console.error('Error loading musicians:', error);
        }
    }

    // create profile element
    function createProfileElement(profile) {
        const profileCard = document.createElement('div');
        profileCard.classList.add('col-md-3', 'card', 'profile-card');
        profileCard.innerHTML = `
            <img src="${profile.image}" alt="${profile.name}" class="card-img-top" style="height: 150px; object-fit: cover;">
            <div class="card-body">
                <h5 class="card-title">${profile.name}</h5>
                <p><strong>Instrument(s):</strong> ${profile.instruments}</p>
                <p><strong>Location:</strong> ${profile.location}</p>
                <p>${profile.about}</p>
            </div>
        `;
        return profileCard;
    }

    // show profile form
    function showProfileForm(profile = null) {
        musiciansForm.style.display = 'block';
        createProfileButton.style.display = 'none'; 
        createProfileButton.parentNode.insertAdjacentElement('beforeend', musiciansForm);

        document.getElementById('musicianForm').addEventListener('submit', async (e) => {
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

                createProfileButton.textContent = 'Edit Profile';
                createProfileButton.style.display = 'block';

                const userProfileSection = document.querySelector('#myProfile');
                if (userProfileSection) {
                    userProfileSection.innerHTML = '';
                    userProfileSection.appendChild(createProfileElement(updatedProfile));
                } else {
                    const myProfileDiv = document.createElement('div');
                    myProfileDiv.id = 'myProfile';
                    myProfileDiv.classList.add('row', 'justify-content-center', 'mt-4');
                    myProfileDiv.appendChild(createProfileElement(updatedProfile));
                    createProfileButton.parentNode.insertAdjacentElement('beforebegin', myProfileDiv);
                }

                musiciansForm.style.display = 'none';
            } catch (error) {
                console.error('Error saving profile:', error);
            }
        });
    }

    // save profile
    async function saveProfile(profile) {
        const response = await fetch('/api/user/add', {
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

    // show form
    createProfileButton.addEventListener('click', () => {
        showProfileForm(userProfile);
    });

    loadMusicians();
});