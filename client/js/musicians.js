document.addEventListener("DOMContentLoaded", () => {
    const createProfileButton = document.querySelector('#musicians .btn');
    const musiciansContainer = document.createElement('div');
    const musiciansForm = document.createElement('div');
    let userProfile = null; 

    musiciansContainer.classList.add('row', 'justify-content-center', 'mt-4');
    musiciansForm.style.display = 'none';

    createProfileButton.parentNode.insertAdjacentElement('afterend', musiciansContainer);

    // get musician profiles
    function loadMusicians() {
        fetch('/api/musicians')
            .then(response => response.json())
            .then(musicians => {
                musiciansContainer.innerHTML = ''; 

                musicians.forEach(musician => {
                    if (musician.isUserProfile) {
                        userProfile = musician; 
                    } else {
                        const profileElement = createProfileElement(musician);
                        musiciansContainer.appendChild(profileElement);
                    }
                });

                //get user profile
                fetch('/api/user')
                    .then(response => response.json())
                    .then(profile => {
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
                    });
            })
            .catch(error => console.error('Error loading musicians:', error));
    }


    // create profile
    function createProfileElement(profile) {
        const profileCard = document.createElement('div');
        profileCard.classList.add('col-md-5', 'card', 'm-2', 'p-3', 'text-center');
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
    


    //show form with previous inputs
    function showProfileForm(profile = null) {
        musiciansForm.innerHTML = `
            <h3>${profile ? 'Edit' : 'Create'} My Profile</h3>
            <form id="musicianForm">
                <div class="form-group">
                    <label for="musicianName">Name</label>
                    <input type="text" id="musicianName" class="form-control" value="${profile?.name || ''}" required>
                </div>
                <div class="form-group">
                    <label for="musicianInstruments">Instrument(s)</label>
                    <input type="text" id="musicianInstruments" class="form-control" value="${profile?.instruments || ''}" required>
                </div>
                <div class="form-group">
                    <label for="musicianAbout">About</label>
                    <textarea id="musicianAbout" class="form-control" required>${profile?.about || ''}</textarea>
                </div>
                <div class="form-group">
                    <label for="musicianLocation">Location</label>
                    <input type="text" id="musicianLocation" class="form-control" value="${profile?.location || ''}" required>
                </div>
                <div class="form-group">
                    <label for="musicianImage">Image URL</label>
                    <input type="text" id="musicianImage" class="form-control" value="${profile?.image || ''}" required>
                </div>
                <button type="submit" class="btn btn-primary">${profile ? 'Save Changes' : 'Save Changes'}</button>
            </form>
        `;
        musiciansForm.style.display = 'block';
        createProfileButton.parentNode.insertAdjacentElement('beforeend', musiciansForm);


        document.getElementById('musicianForm').addEventListener('submit', (e) => {
            e.preventDefault();

            //form data
            const updatedProfile = {
                name: document.getElementById('musicianName').value,
                instruments: document.getElementById('musicianInstruments').value,
                about: document.getElementById('musicianAbout').value,
                location: document.getElementById('musicianLocation').value,
                image: document.getElementById('musicianImage').value,
            };



            fetch('/api/user/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProfile)
            })
            .then(() => {
                createProfileButton.textContent = 'Edit Profile';

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
            })
            .catch(error => console.error('Error saving profile:', error));
        });
    }

    
    createProfileButton.addEventListener('click', () => {
        showProfileForm(userProfile); 
    });
    loadMusicians();
});