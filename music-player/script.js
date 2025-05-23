document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const progressBar = document.querySelector('.progress-bar');
    const progress = document.querySelector('.progress');
    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');
    const songList = document.getElementById('song-list');
    let songItems = document.querySelectorAll('.song-item');
    const songTitle = document.getElementById('song-title');
    const artistName = document.getElementById('artist-name');
    const albumArt = document.getElementById('album-art');
    const addSongBtn = document.getElementById('add-song-btn');
    const addSongModal = document.getElementById('add-song-modal');
    const closeModal = document.querySelector('.close-modal');
    const addSongForm = document.getElementById('add-song-form');
    const albumArtPreview = document.getElementById('album-art-preview');
    const albumArtInput = document.getElementById('album-art-input');

    let currentSongIndex = 0;
    let isPlaying = false;

    // Play/Pause functionality
    playBtn.addEventListener('click', togglePlay);
    audioPlayer.addEventListener('play', updatePlayButton);
    audioPlayer.addEventListener('pause', updatePlayButton);

    // Previous and Next buttons
    prevBtn.addEventListener('click', playPreviousSong);
    nextBtn.addEventListener('click', playNextSong);

    // Volume control
    volumeSlider.addEventListener('input', function() {
        audioPlayer.volume = this.value / 100;
    });

    // Progress bar
    audioPlayer.addEventListener('timeupdate', updateProgress);
    progressBar.addEventListener('click', setProgress);

    // Song list click events
    songItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentSongIndex = index;
            loadAndPlaySong(item);
        });
    });

    // Add Song Modal functionality
    addSongBtn.addEventListener('click', () => {
        addSongModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        addSongModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === addSongModal) {
            addSongModal.style.display = 'none';
        }
    });

    // Get modal elements
    const createPlaylistModal = document.getElementById('create-playlist-modal');
    const createPlaylistForm = document.getElementById('create-playlist-form');
    const playlistCoverInput = document.getElementById('playlist-cover');
    const playlistCoverPreview = document.getElementById('playlist-cover-preview');

    // Update create playlist button click handler
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

        // Create a new playlist section
        const playlistSection = document.createElement('div');
        playlistSection.className = 'playlist-section';
        
        // Create playlist header
        const playlistHeader = document.createElement('div');
        playlistHeader.className = 'playlist-header';
        
        // Create playlist cover if provided
        let coverImage = '';
        if (playlistCoverFile) {
            const coverUrl = URL.createObjectURL(playlistCoverFile);
            coverImage = `<img src="${coverUrl}" alt="${playlistName}" class="playlist-cover">`;
        }

        playlistHeader.innerHTML = `
            <div class="playlist-info">
                ${coverImage}
                <div>
                    <h3><i class="bi bi-music-note-list"></i> ${playlistName}</h3>
                    ${playlistDescription ? `<p class="playlist-description">${playlistDescription}</p>` : ''}
                </div>
            </div>
            <div class="playlist-controls">
                <button class="control-btn add-song-btn"><i class="bi bi-plus-circle"></i> Add Song</button>
                <button class="control-btn delete-playlist-btn"><i class="bi bi-trash"></i></button>
            </div>
        `;

        // Create playlist content
        const playlistContent = document.createElement('div');
        playlistContent.className = 'playlist-content';
        const songList = document.createElement('ul');
        songList.className = 'song-list';
        songList.id = `playlist-${playlistName.toLowerCase().replace(/\s+/g, '-')}`;

        // Assemble playlist section
        playlistContent.appendChild(songList);
        playlistSection.appendChild(playlistHeader);
        playlistSection.appendChild(playlistContent);

        // Add to the playlists container
        const playlistsContainer = document.querySelector('.playlists-container');
        if (playlistsContainer) {
            playlistsContainer.appendChild(playlistSection);
        } else {
            // If container doesn't exist, create it
            const newContainer = document.createElement('div');
            newContainer.className = 'playlists-container';
            newContainer.appendChild(playlistSection);
            document.querySelector('.music-player').appendChild(newContainer);
        }

        // Add event listeners for the new playlist
        const addSongBtn = playlistHeader.querySelector('.add-song-btn');
        const deletePlaylistBtn = playlistHeader.querySelector('.delete-playlist-btn');

        addSongBtn.addEventListener('click', () => {
            addSongModal.style.display = 'block';
            addSongModal.dataset.playlistId = songList.id;
        });

        deletePlaylistBtn.addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete the playlist "${playlistName}"?`)) {
                // Revoke the cover image URL if it exists
                if (playlistCoverFile) {
                    URL.revokeObjectURL(playlistCoverPreview.src);
                }
                playlistSection.remove();
            }
        });

        // Clear form and close modal
        createPlaylistForm.reset();
        playlistCoverPreview.style.display = 'none';
        createPlaylistModal.style.display = 'none';

        // Show success message
        alert(`Playlist "${playlistName}" created successfully!`);
    });

    // Update close modal functionality to work with multiple modals
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

    // Handle form submission
    addSongForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const songFile = document.getElementById('song-file').files[0];
        const title = document.getElementById('song-title-input').value;
        const artist = document.getElementById('artist-name-input').value;
        const albumArtFile = document.getElementById('album-art-input').files[0];
        const playlistId = addSongModal.dataset.playlistId || 'song-list'; // Default to main playlist if not specified

        if (!songFile) {
            alert('Please select a song file!');
            return;
        }

        if (!title || !artist) {
            alert('Please fill in all required fields!');
            return;
        }

        try {
            // Create a new song item
            const songItem = document.createElement('li');
            songItem.className = 'song-item';
            
            // Create object URL for the song file
            const songUrl = URL.createObjectURL(songFile);
            songItem.setAttribute('data-src', songUrl);
            songItem.setAttribute('data-title', title);
            songItem.setAttribute('data-artist', artist);

            // Handle album art
            if (albumArtFile) {
                const albumArtUrl = URL.createObjectURL(albumArtFile);
                songItem.setAttribute('data-album-art', albumArtUrl);
            }

            // Create song info container
            const songInfoContainer = document.createElement('div');
            songInfoContainer.className = 'song-info-container';

            // Add title and artist
            const songTitle = document.createElement('span');
            songTitle.className = 'song-title';
            songTitle.textContent = title;

            const songArtist = document.createElement('span');
            songArtist.className = 'song-artist';
            songArtist.textContent = artist;

            // Add delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteSong(songItem);
            });

            // Assemble the song item
            songInfoContainer.appendChild(songTitle);
            songInfoContainer.appendChild(songArtist);
            songItem.appendChild(songInfoContainer);
            songItem.appendChild(deleteBtn);

            // Add click event to play the song
            songItem.addEventListener('click', () => {
                currentSongIndex = Array.from(songItems).indexOf(songItem);
                loadAndPlaySong(songItem);
            });

            // Add to the specified playlist
            const targetPlaylist = document.getElementById(playlistId);
            if (targetPlaylist) {
                targetPlaylist.appendChild(songItem);
            } else {
                // Fallback to main playlist if specified playlist doesn't exist
                songList.appendChild(songItem);
            }
            
            // Update songItems NodeList
            songItems = document.querySelectorAll('.song-item');

            // Clear form and close modal
            addSongForm.reset();
            addSongModal.style.display = 'none';
            delete addSongModal.dataset.playlistId; // Clear the playlist ID

            // Show success message
            alert('Song added successfully!');
        } catch (error) {
            console.error('Error adding song:', error);
            alert('Error adding song. Please try again.');
        }
    });

    // Delete song functionality
    function deleteSong(songItem) {
        if (songItems.length <= 1) {
            alert('Cannot delete the last song in the playlist!');
            return;
        }

        const index = Array.from(songItems).indexOf(songItem);
        if (index === currentSongIndex) {
            // If deleting current song, play next song
            playNextSong();
        } else if (index < currentSongIndex) {
            // If deleting a song before current, adjust current index
            currentSongIndex--;
        }

        // Revoke the object URLs to free up memory
        const songUrl = songItem.getAttribute('data-src');
        const albumArtUrl = songItem.getAttribute('data-album-art');
        
        if (songUrl && songUrl.startsWith('blob:')) {
            URL.revokeObjectURL(songUrl);
        }
        if (albumArtUrl && albumArtUrl.startsWith('blob:')) {
            URL.revokeObjectURL(albumArtUrl);
        }

        // Remove the song item
        songItem.remove();
        
        // Update songItems NodeList
        songItems = document.querySelectorAll('.song-item');
    }

    // Add delete functionality to existing songs
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const songItem = btn.parentElement;
            deleteSong(songItem);
        });
    });

    // Functions
    function togglePlay() {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    }

    function updatePlayButton() {
        const playIcon = playBtn.querySelector('i');
        if (audioPlayer.paused) {
            playIcon.className = 'bi bi-play-fill';
        } else {
            playIcon.className = 'bi bi-pause-fill';
        }
    }

    function loadAndPlaySong(songItem) {
        const src = songItem.getAttribute('data-src');
        const title = songItem.getAttribute('data-title');
        const artist = songItem.getAttribute('data-artist');
        const albumArtUrl = songItem.getAttribute('data-album-art');

        audioPlayer.src = src;
        songTitle.textContent = title;
        artistName.textContent = artist;
        
        // Update album art
        if (albumArtUrl) {
            albumArt.src = albumArtUrl;
        } else {
            albumArt.src = 'default-album.jpg'; // Use default image if no album art
        }
        
        // Update active song in playlist
        songItems.forEach(item => item.classList.remove('active'));
        songItem.classList.add('active');

        audioPlayer.play();
    }

    function playPreviousSong() {
        currentSongIndex = (currentSongIndex - 1 + songItems.length) % songItems.length;
        loadAndPlaySong(songItems[currentSongIndex]);
    }

    function playNextSong() {
        currentSongIndex = (currentSongIndex + 1) % songItems.length;
        loadAndPlaySong(songItems[currentSongIndex]);
    }

    function updateProgress() {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progress.style.width = percent + '%';
        
        // Update time displays
        currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
        durationSpan.textContent = formatTime(audioPlayer.duration);
    }

    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
    }

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Initialize volume
    audioPlayer.volume = volumeSlider.value / 100;

    // Add album art preview functionality
    albumArtInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                albumArtPreview.src = e.target.result;
                albumArtPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            albumArtPreview.style.display = 'none';
        }
    });

    // Add search functionality
    const searchInput = document.querySelector('.search-input');
    const playlist = document.getElementById('playlist');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const songs = playlist.getElementsByTagName('li');
        
        Array.from(songs).forEach(song => {
            const songTitle = song.querySelector('.song-title').textContent.toLowerCase();
            const songArtist = song.querySelector('.song-artist').textContent.toLowerCase();
            
            if (songTitle.includes(searchTerm) || songArtist.includes(searchTerm)) {
                song.style.display = '';
            } else {
                song.style.display = 'none';
            }
        });
    });

    // Add beat animation functionality
    function updateBeatAnimation(isPlaying) {
        const albumArt = document.getElementById('album-art');
        const playBtn = document.getElementById('play-btn');
        const songInfo = document.querySelector('.song-info');
        const progress = document.querySelector('.progress');
        const visualizerBars = document.querySelectorAll('.visualizer-bar');

        if (isPlaying) {
            albumArt.classList.add('playing');
            playBtn.classList.add('playing');
            songInfo.classList.add('playing');
            progress.classList.add('playing');
            
            // Animate visualizer bars with random heights
            visualizerBars.forEach((bar, index) => {
                bar.classList.add('animate');
                bar.style.animationDelay = `${index * 0.1}s`;
                bar.style.height = `${Math.random() * 40 + 20}px`;
            });
        } else {
            albumArt.classList.remove('playing');
            playBtn.classList.remove('playing');
            songInfo.classList.remove('playing');
            progress.classList.remove('playing');
            
            // Stop visualizer animation
            visualizerBars.forEach(bar => {
                bar.classList.remove('animate');
                bar.style.height = '20px';
            });
        }
    }

    // Update the playSong function
    function playSong(index) {
        if (currentSongIndex === index) {
            if (audioPlayer.paused) {
                audioPlayer.play();
                playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
                updateBeatAnimation(true);
            } else {
                audioPlayer.pause();
                playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
                updateBeatAnimation(false);
            }
        } else {
            currentSongIndex = index;
            audioPlayer.src = songItems[currentSongIndex].getAttribute('data-src');
            audioPlayer.play();
            playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
            updateSongInfo();
            updateBeatAnimation(true);
        }
    }

    // Update the audio event listeners
    audioPlayer.addEventListener('pause', () => {
        playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
        updateBeatAnimation(false);
    });

    audioPlayer.addEventListener('play', () => {
        playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
        updateBeatAnimation(true);
    });

    // Update the updateSongInfo function
    function updateSongInfo() {
        const currentSong = songItems[currentSongIndex];
        songTitle.textContent = currentSong.getAttribute('data-title');
        artistName.textContent = currentSong.getAttribute('data-artist');
        const albumArtUrl = currentSong.getAttribute('data-album-art');
        if (albumArtUrl) {
            albumArt.src = albumArtUrl;
        } else {
            albumArt.src = 'default-album.jpg'; // Use default image if no album art
        }
        updateBeatAnimation(!audioPlayer.paused);
    }
}); 