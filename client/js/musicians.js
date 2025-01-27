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
                if (musicians.length === 0) {
                    musiciansContainer.innerHTML = '<p>No musician profiles available.</p>';
                } else {
                    musicians.forEach(musician => {
                        const profileElement = createProfileElement(musician);
                        musiciansContainer.appendChild(profileElement);
                    });
                }
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


    createProfileButton.addEventListener('click', () => {
        if (!userProfile) {

            musiciansForm.innerHTML = `
                <h3>${userProfile ? 'Edit' : 'Create'} My Profile</h3>
                <form id="musicianForm">
                    <div class="form-group">
                        <label for="musicianName">Name</label>
                        <input type="text" id="musicianName" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="musicianInstruments">Instrument(s)</label>
                        <input type="text" id="musicianInstruments" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="musicianAbout">About</label>
                        <textarea id="musicianAbout" class="form-control" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="musicianLocation">Location</label>
                        <input type="text" id="musicianLocation" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="musicianImage">Image URL</label>
                        <input type="text" id="musicianImage" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary">${userProfile ? 'Edit' : 'Create'} Profile</button>
                </form>
            `;
            musiciansForm.style.display = 'block';
            createProfileButton.parentNode.insertAdjacentElement('beforeend', musiciansForm);
        } else {
            
            document.getElementById('musicianName').value = userProfile.name;
            document.getElementById('musicianInstruments').value = userProfile.instruments;
            document.getElementById('musicianAbout').value = userProfile.about;
            document.getElementById('musicianLocation').value = userProfile.location;
            document.getElementById('musicianImage').value = userProfile.image;
        }

        document.getElementById('musicianForm').addEventListener('submit', (e) => {
            e.preventDefault();

            //form data
            userProfile = {
                name: document.getElementById('musicianName').value,
                instruments: document.getElementById('musicianInstruments').value,
                about: document.getElementById('musicianAbout').value,
                location: document.getElementById('musicianLocation').value,
                image: document.getElementById('musicianImage').value,
            };


            createProfileButton.textContent = 'Edit Profile';

            const userProfileSection = document.querySelector('#myProfile');
            if (userProfileSection) {
                userProfileSection.innerHTML = '';
                userProfileSection.appendChild(createProfileElement(userProfile));
            } else {
                const myProfileDiv = document.createElement('div');
                myProfileDiv.id = 'myProfile';
                myProfileDiv.appendChild(createProfileElement(userProfile));
                createProfileButton.parentNode.insertAdjacentElement('beforebegin', myProfileDiv);
            }


            musiciansForm.style.display = 'none';
        });
    });

    loadMusicians();
});