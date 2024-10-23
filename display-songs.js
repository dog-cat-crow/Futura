document.addEventListener('DOMContentLoaded', () => {
    fetch('songs.json')
        .then(response => response.json())
        .then(data => {
            const songData = data.songs;
            displaySongs(songData);
        })
        .catch(error => {
            console.error('Error fetching songs:', error);
        });
});

// Display songs in the song list
function displaySongs(songs) {
    const songList = document.getElementById('songList');
    songList.innerHTML = '';

    songs.forEach(title => {
        const songItem = document.createElement('div');
        songItem.classList.add('songItem');
        const file = `${title}.mp3`;
        const image = `${title}.jpg`;

        songItem.dataset.song = file;
        songItem.dataset.image = image;
        songItem.innerText = title;

        songItem.onclick = () => {
            openSongDetail(title, file, image);
        };

        songList.appendChild(songItem);
    });
}

// Function to filter songs based on search input
function filterSongs(query) {
    const filteredSongs = songData.filter(song => song.toLowerCase().includes(query.toLowerCase()));
    displaySongs(filteredSongs);
}

// Example: Assuming 'searchBar' is defined in window-player.js
const searchBar = document.getElementById('searchBar');
searchBar.addEventListener('input', () => {
    filterSongs(searchBar.value);
});
