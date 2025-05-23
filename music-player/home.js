function createNewPlaylist() {
    const playlistName = prompt('Enter playlist name:');
    if (playlistName) {
        // Here you can add functionality to create a new playlist
        alert(`Playlist "${playlistName}" created!`);
    }
}

// Add any additional home page functionality here 

document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const createPlaylistModal = document.getElementById('create-playlist-modal');
    const createPlaylistForm = document.getElementById('create-playlist-form');
    const playlistCoverInput = document.getElementById('playlist-cover');
    const playlistCoverPreview = document.getElementById('playlist-cover-preview');

    // Create playlist button click handler
    const createPlaylistBtn = document.getElementById('create-playlist-btn');
    if (createPlaylistBtn) {
        createPlaylistBtn.addEventListener('click', () => {
            createPlaylistModal.style.display = 'block';
        });
    }

    // Handle playlist cover image preview
    playlistCoverInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                playlistCoverPreview.src = e.target.result;
                playlistCoverPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            playlistCoverPreview.style.display = 'none';
        }
    });

    // Handle create playlist form submission
    createPlaylistForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const playlistName = document.getElementById('playlist-name').value;
        const playlistDescription = document.getElementById('playlist-description').value;
        const playlistCoverFile = playlistCoverInput.files[0];

        if (!playlistName) {
            alert('Please enter a playlist name!');
            return;
        }

        // Create a new playlist card
        const playlistCard = document.createElement('div');
        playlistCard.className = 'playlist-card';
        
        // Create playlist cover if provided
        let coverImage = '';
        if (playlistCoverFile) {
            const coverUrl = URL.createObjectURL(playlistCoverFile);
            coverImage = `<img src="${coverUrl}" alt="${playlistName}">`;
        } else {
            // Use default image if no cover provided
            coverImage = `<img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format" alt="${playlistName}">`;
        }

        playlistCard.innerHTML = `
            ${coverImage}
            <h3>${playlistName}</h3>
            ${playlistDescription ? `<p>${playlistDescription}</p>` : '<p>No description</p>'}
            <div class="playlist-actions">
                <button class="playlist-action-btn edit-btn"><i class="bi bi-pencil"></i></button>
                <button class="playlist-action-btn delete-btn"><i class="bi bi-trash"></i></button>
            </div>
        `;

        // Add click event to open player
        playlistCard.addEventListener('click', (e) => {
            if (!e.target.closest('.playlist-actions')) {
                window.location.href = 'index.html';
            }
        });

        // Add event listeners for action buttons
        const editBtn = playlistCard.querySelector('.edit-btn');
        const deleteBtn = playlistCard.querySelector('.delete-btn');

        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // TODO: Implement edit functionality
            alert('Edit functionality coming soon!');
        });

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Are you sure you want to delete the playlist "${playlistName}"?`)) {
                // Revoke the cover image URL if it exists
                if (playlistCoverFile) {
                    URL.revokeObjectURL(playlistCoverPreview.src);
                }
                playlistCard.remove();
            }
        });

        // Add to the playlists container
        const playlistsContainer = document.querySelector('.playlists-container');
        if (playlistsContainer) {
            playlistsContainer.appendChild(playlistCard);
        }

        // Clear form and close modal
        createPlaylistForm.reset();
        playlistCoverPreview.style.display = 'none';
        createPlaylistModal.style.display = 'none';

        // Show success message
        alert(`Playlist "${playlistName}" created successfully!`);
    });

    // Close modal functionality
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modalId = closeBtn.dataset.modal;
            if (modalId) {
                document.getElementById(modalId).style.display = 'none';
            }
        });
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}); 