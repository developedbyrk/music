const playlists = [
  {
    name: "Bhajans (1) MP3",
    tracks: [
      {
        title: "Racha Hai Srishti Ko Jis Prabhu Ne",
        url: "./bhajan/mp3/RachaHaiSrishtiKoJisPrabhuNe.mp3",
      },
      {
        title: "Ram Nam Ke Hire Moti",
        url: "./bhajan/mp3/RamNamKeHireMoti.mp3",
      },
      {
        title: "Mujhe Tumne Malik Bahut Diya Hai",
        url: "./bhajan/mp3/MujheTumneMalikBahutDeDiyahai.mp3",
      },
      {
        title: "Karpur Gauram Karunavtaram",
        url: "./bhajan/mp3/KarpurGauramKarunavtaram.mp3",
      },
      {
        title: "Bhole Girijapati Hu Tamhari Sharan",
        url: "./bhajan/mp3/BholeGirijapatihuTamhariSharan.mp3",
      },
      {
        title: "Hey Shiv Pita Parmatma",
        url: "./bhajan/mp3/HeyShivPitaParmatma.mp3",
      },
      {
        title: "Ram Rachit Shambu Stuti",
        url: "./bhajan/mp3/RamRachitShambuStuti.mp3",
      },
      {
        title: "Satyam Shivam Sundaram",
        url: "./bhajan/mp3/SatyamShivamSundaram.mp3",
      },
      {
        title: "Lingaashtakam",
        url: "./bhajan/mp3/Lingaashtakam.mp3",
      },
    ],
  },
  {
    name: "Bhajans (2) MP3",
    tracks: [
      {
        title: "Shambho Shankar Namah Shivay",
        url: "./bhajan/mp3/ShivStuti-ShambhoShankarNamahShivay.mp3",
      },
      {
        title: "Shri Hanuman Chalisa",
        url: "./bhajan/mp3/ShriHanumanChalisa.mp3",
      },
      {
        title: "Sundar Kand",
        url: "./bhajan/mp3/SundarKand.mp3",
      },
      {
        title: "Kisori Kuch Aisa Intjam Ho Jaye",
        url: "./bhajan/mp3/KISHORIKUCHAISAINTJAMHOJAYE.mp3",
      },
      {
        title: "Pakad Lo Hath Banvari Nahin To Doob Jaenge",
        url: "./bhajan/mp3/PakadLoHathBanvariNahinToDoobJaenge.mp3",
      },
    ],
  },
  {
    name: "Bhajans MP4",
    tracks: [
      {
        title: "Shri Durga Raksha Kavach",
        url: "./bhajan/mp4/shri-durga-raksha-kavach.mp4",
      },
    ],
  },
];

let currentPlaylistIndex = 0;
let currentTrackIndex = 0;
let isAutoplay = true;

const audioPlayer = document.getElementById("audioPlayer");
const videoPlayer = document.getElementById("videoPlayer");
const autoplayToggle = document.getElementById("autoplayToggle");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const currentSongTitle = document.getElementById("currentSongTitle");
const currentPlaylistTitle = document.getElementById("currentPlaylist");
const searchInput = document.getElementById("searchInput");
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

// Autoplay toggle
autoplayToggle.addEventListener("click", () => {
  isAutoplay = !isAutoplay;
  autoplayToggle.textContent = isAutoplay ? "Autoplay: ON" : "Autoplay: OFF";
});

// Handle autoplay after track ends
function handleAutoplay() {
  const currentPlaylist = playlists[currentPlaylistIndex];
  if (isAutoplay) {
    currentTrackIndex++;
    if (currentTrackIndex >= currentPlaylist.tracks.length) {
      currentTrackIndex = 0; // Loop back to the first track
    }
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
      trackItem.textContent = track.title;
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

// Initialize the player
function initializePlayer() {
  renderPlaylists();
  updateCurrentSongTitle();
}

// Search functionality
searchInput.addEventListener("input", () => {
  const searchQuery = searchInput.value.trim();
  renderPlaylists(searchQuery); // Re-render playlists based on the search query
});

initializePlayer();