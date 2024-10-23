<script>
    let songData = [];
    let activePlayers = {};
    let currentlyPlayingSong = null;

    fetch('songs.json')
        .then(response => response.json())
        .then(data => {
            songData = data.songs;
            displaySongs(songData);
            setUpSongListeners();
        })
        .catch(error => {
            console.error('Error fetching songs:', error);
        });

    const searchBar = document.getElementById('searchBar');
    searchBar.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase();
        const filteredSongs = songData.filter(song => song.toLowerCase().includes(query));
        displaySongs(filteredSongs);
    });

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

    function openSongDetail(title, file, image) {
        document.getElementById('songName').innerText = title;
        document.getElementById('songImage').src = image;

        let audioPlayer;
        if (!activePlayers[title]) {
            audioPlayer = new Audio(file);
            audioPlayer.style.display = 'none';
            activePlayers[title] = { player: audioPlayer, isPlaying: false, lastTime: 0 };
        } else {
            audioPlayer = activePlayers[title].player;
        }

        document.getElementById('songDetail').style.display = 'block';
        document.body.style.overflow = 'hidden';

        const playPauseButton = document.getElementById('playPauseButton');
        const playPauseIcon = document.getElementById('playPauseIcon');

        playPauseButton.onclick = () => {
            // Check if there's another song currently playing and pause it
            if (currentlyPlayingSong && currentlyPlayingSong !== title) {
                activePlayers[currentlyPlayingSong].player.pause();
                activePlayers[currentlyPlayingSong].isPlaying = false;
                activePlayers[currentlyPlayingSong].lastTime = 0; // Reset time for the other song
                updatePlayPauseIcon(playPauseIcon, false);
            }

            // Start from the last known time if it's being resumed
            audioPlayer.currentTime = activePlayers[title].lastTime;

            if (activePlayers[title].isPlaying) {
                audioPlayer.pause();
                activePlayers[title].isPlaying = false;
                activePlayers[title].lastTime = audioPlayer.currentTime; // Save the current time
                currentlyPlayingSong = null;
            } else {
                audioPlayer.play();
                activePlayers[title].isPlaying = true;
                currentlyPlayingSong = title;
            }

            updatePlayPauseIcon(playPauseIcon, activePlayers[title].isPlaying);
        };

        audioPlayer.onended = () => {
            activePlayers[title].isPlaying = false;
            currentlyPlayingSong = null;
            updatePlayPauseIcon(playPauseIcon, false);
            playNextSong(title);
        };

        updatePlayPauseIcon(playPauseIcon, activePlayers[title].isPlaying);

        document.getElementById('closeDetail').onclick = () => {
            document.getElementById('songDetail').style.display = 'none';
            document.body.style.overflow = '';
        };
    }

    function playNextSong(currentTitle) {
        const currentIndex = songData.indexOf(currentTitle);
        const nextIndex = (currentIndex + 1) % songData.length;
        const nextTitle = songData[nextIndex];
        const nextFile = `${nextTitle}.mp3`;
        const nextImage = `${nextTitle}.jpg`;

        // Reset time to 0 for the next song
        activePlayers[currentTitle].lastTime = 0;

        openSongDetail(nextTitle, nextFile, nextImage);
    }

    function updatePlayPauseIcon(icon, isPlaying) {
        icon.src = isPlaying ? 'pause.png' : 'play.png';
    }

    function setUpSongListeners() {
        const audioPlayer = document.getElementById('audioPlayer');

        if (songData.length > 0) {
            playSong(songData[0]);
        }
    }

    function playSong(title) {
        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = `${title}.mp3`;
        audioPlayer.play();
    }

    window.addEventListener('resize', applyResponsiveStyles);
    applyResponsiveStyles();

    function applyResponsiveStyles() {
        const screenWidth = window.innerWidth;

        const songNameFontSize = (screenWidth * 6.67) / 100;
        const songImageSize = (screenWidth * 50) / 100;
        const buttonContainerPadding = (screenWidth * 16.67) / 100;
        const playPauseButtonSize = (screenWidth * 19.44) / 100;
        const closeButtonSize = (screenWidth * 6.94) / 100;
        const headerPadding = (screenWidth * 5.56) / 100;
        const searchBarWidth = (screenWidth * 83.33) / 100;
        const songItemPadding = (screenWidth * 3.89) / 100;

        document.getElementById('songName').style.fontSize = songNameFontSize + 'px';
        document.getElementById('songImage').style.width = songImageSize + 'px';
        document.getElementById('songImage').style.height = songImageSize + 'px';
        document.getElementById('buttonContainer').style.paddingLeft = buttonContainerPadding + 'px';
        document.getElementById('buttonContainer').style.paddingRight = buttonContainerPadding + 'px';
        document.getElementById('playPauseIcon').style.maxWidth = playPauseButtonSize + 'px';
        document.getElementById('playPauseIcon').style.maxHeight = playPauseButtonSize + 'px';
        document.getElementById('closeDetail').style.fontSize = closeButtonSize + 'px';
        document.getElementById('header').style.padding = headerPadding + 'px 0';
        document.getElementById('searchBar').style.width = searchBarWidth + 'px';

        const songItems = document.getElementsByClassName('songItem');
        for (let i = 0; i < songItems.length; i++) {
            songItems[i].style.padding = songItemPadding + 'px 0';
        }
    }
</script>
