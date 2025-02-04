let currentPlaylistIndex = 0;
let currentTrackIndex = 0;
let isAutoplay = true;
let repeatMode = false; // false - No repeat, true - Repeat current track

const audioPlayer = document.getElementById("audioPlayer");
const videoPlayer = document.getElementById("videoPlayer");
const autoplayToggle = document.getElementById("autoplayToggle");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const currentSongTitle = document.getElementById("currentSongTitle");
const currentPlaylistTitle = document.getElementById("currentPlaylist");
const searchInput = document.getElementById("searchInput");
// Playlist toggle button and icons
const toggleAllBtn = document.getElementById("toggleAllBtn");
const onIcon = document.getElementById("on");
const offIcon = document.getElementById("off");
// Get the button to close all accordions
const playlistsContainer = document.getElementById("playlistsContainer");

// Update the current song title
function updateCurrentSongTitle() {
  const currentPlaylist = playlists[currentPlaylistIndex];
  const currentTrack = currentPlaylist.tracks[currentTrackIndex];
  currentPlaylistTitle.textContent = `Playlist: ${currentPlaylist.name}`;
  currentSongTitle.textContent = `${currentTrack.title}`;
}

// Play media (audio or video)
function playMedia() {
  const currentTrack =
    playlists[currentPlaylistIndex].tracks[currentTrackIndex];
  audioPlayer.pause();
  videoPlayer.pause();

  if (currentTrack.url.endsWith(".mp4")) {
    videoPlayer.src = currentTrack.url;
    videoPlayer.classList.remove("hidden");
    audioPlayer.classList.add("hidden");
    videoPlayer.play();
  } else {
    audioPlayer.src = currentTrack.url;
    audioPlayer.classList.remove("hidden");
    videoPlayer.classList.add("hidden");
    audioPlayer.play();
  }

  updateCurrentSongTitle();
}

// Play next track
nextBtn.addEventListener("click", () => {
  const currentPlaylist = playlists[currentPlaylistIndex];
  if (currentTrackIndex < currentPlaylist.tracks.length - 1) {
    currentTrackIndex++;
  } else if (isAutoplay) {
    currentTrackIndex = 0;
  }
  playMedia();
});

// Play previous track
prevBtn.addEventListener("click", () => {
  const currentPlaylist = playlists[currentPlaylistIndex];
  if (currentTrackIndex > 0) {
    currentTrackIndex--;
  } else {
    currentTrackIndex = currentPlaylist.tracks.length - 1;
  }
  playMedia();
});

// Repeat button functionality
const repeatBtn = document.getElementById("repeatBtn");

repeatBtn.addEventListener("click", () => {
  repeatMode = !repeatMode; // Toggle repeatMode between true/false

  // Update the button's icon based on repeatMode
  if (repeatMode) {
    repeatBtn.title = "Repeat current track";
    repeatBtn.classList.add("repeat-track");
  } else {
    repeatBtn.title = "No repeat";
    repeatBtn.classList.remove("repeat-track");
  }
});

// Autoplay toggle
autoplayToggle.addEventListener("click", () => {
  isAutoplay = !isAutoplay;
  // Update the button's classes to reflect autoplay state
  autoplayToggle.classList = isAutoplay ? "autoplay-on" : "autoplay-off";
});

// Handle autoplay after track ends (just last track not stoping in the end, rest are working fine)
// function handleAutoplay() {
//   const currentPlaylist = playlists[currentPlaylistIndex];

//   // Repeat the current track if repeatMode is true
//   if (repeatMode) {
//     playMedia(); // Replay the current track
//   } else if (isAutoplay) {
//     // Otherwise, move to the next track (if autoplay is on)
//     currentTrackIndex++;
//     if (currentTrackIndex >= currentPlaylist.tracks.length) {
//       currentTrackIndex = 0; // Loop back to the first track if autoplay is on
//     }
//     playMedia();
//   }
// }

// Handle autoplay after track ends (autoplay, repeat, and last track stop if no repeat)
function handleAutoplay() {
  const currentPlaylist = playlists[currentPlaylistIndex];

  // If repeatMode is enabled, repeat the current track
  if (repeatMode) {
    playMedia(); // Replay the current track
  } else if (isAutoplay) {
    // Move to the next track only if it's not the last track
    currentTrackIndex++;

    if (currentTrackIndex >= currentPlaylist.tracks.length) {
      // Stop at the last track (do nothing further if at the end)
      currentTrackIndex = currentPlaylist.tracks.length - 1;
      return; // Do nothing, stay on the last track
    }

    // Play the next track
    playMedia();
  }
}

// Add event listeners for track end (to trigger autoplay)
audioPlayer.addEventListener("ended", handleAutoplay);
videoPlayer.addEventListener("ended", handleAutoplay);

// Render playlists with search functionality
function renderPlaylists(searchQuery = "") {
  playlistsContainer.innerHTML = "";
  playlists.forEach((playlist, playlistIndex) => {
    const playlistElement = document.createElement("div");
    playlistElement.className = "playlist-accordion";

    const playlistHeader = document.createElement("button");
    playlistHeader.className = "accordion-header";
    playlistHeader.textContent = playlist.name;
    playlistHeader.addEventListener("click", () => {
      const content = playlistElement.querySelector(".accordion-content");
      content.style.display =
        content.style.display === "none" ? "flex" : "none";
    });

    const playlistContent = document.createElement("div");
    playlistContent.className = "accordion-content";
    playlistContent.style.display = "flex"; // All playlists open by default

    playlist.tracks.forEach((track, trackIndex) => {
      if (
        searchQuery &&
        !track.title.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return; // Skip tracks that don't match the search query
      }

      const trackItem = document.createElement("div");
      trackItem.className = "track-item";
      // trackItem.textContent = track.title; // Removed to add thumbnail to the track
      // code added to add thumbnail to the track
      const trackContent = document.createElement("div");
      trackContent.className = "track-content";

      const titleSpan = document.createElement("span");
      titleSpan.textContent = track.title;
      trackContent.appendChild(titleSpan);

      // Generate and append a thumbnail for video tracks
      if (track.url.endsWith(".mp4")) {
        getVideoThumbnail(track.url)
          .then((thumbnailUrl) => {
            const thumbImg = document.createElement("img");
            thumbImg.src = thumbnailUrl; // Use blob URL instead of base64
            thumbImg.alt = track.title;
            thumbImg.className = "thumbnail";
            trackContent.insertBefore(thumbImg, titleSpan);
          })
          .catch((err) => console.error(err));
      }

      trackItem.appendChild(trackContent);
      //code eneded to added the thumbnail to the track
      trackItem.addEventListener("click", () => {
        currentPlaylistIndex = playlistIndex;
        currentTrackIndex = trackIndex;
        playMedia();
      });

      playlistContent.appendChild(trackItem);
    });

    playlistElement.appendChild(playlistHeader);
    playlistElement.appendChild(playlistContent);
    playlistsContainer.appendChild(playlistElement);
  });
}

// Add event listener for the "Toggle All" button
toggleAllBtn.addEventListener("click", () => {
  // Get all the accordion contents
  const accordionContents = document.querySelectorAll(".accordion-content");
  // Check if all are open (i.e., if one is closed)
  const allOpen = Array.from(accordionContents).every(
    (content) => content.style.display === "flex"
  );

  // Toggle the display of all accordions based on the current state
  accordionContents.forEach((content) => {
    content.style.display = allOpen ? "none" : "flex";
  });

  // Toggle the icons
  onIcon.style.display = allOpen ? "none" : "inline";
  offIcon.style.display = allOpen ? "inline" : "none";
});

// Initialize the player
function initializePlayer() {
  // renderPlaylists();
  // updateCurrentSongTitle();
  currentPlaylistIndex = 0; // Set the first playlist
  currentTrackIndex = 0; // Set the first track in the playlist
  playMedia(); // Play the first track and make the player visible
  renderPlaylists(); // Render the playlists
}

// Search functionality
searchInput.addEventListener("input", () => {
  const searchQuery = searchInput.value.trim();
  renderPlaylists(searchQuery); // Re-render playlists based on the search query
});

initializePlayer();
