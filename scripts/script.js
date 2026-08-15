let currentSong = new Audio();
let icon;

function formatSongName(song) {
    return song
        .replace(/-no\d+-.*\.mp3$/, "")
        .replaceAll("-", " ")
        .replace("free", "")
        .replace("neffex", "")
        .replace("copyright", "")
        .replace("official video", "");
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;
    let links = div.getElementsByTagName("a");

    let songs = [];
    for (let i = 0; i < links.length; i++) {
        const element = links[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split('/songs/')[1]);
        }
    }
    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = "/songs/" + track;
    
    if(!pause){
        currentSong.play();
        icon.src = './svg/pause.svg';

    }


    document.getElementById('songInfo').innerText =
        formatSongName(track);

    document.getElementById('songTime').innerText =
        "00:00 | 00:00";
}

async function main() {
    let songs = await getSongs();
    playMusic(songs[0], true);

    const previousBtn = document.getElementById('previous-btn');
    const playBtn = document.getElementById('play-btn');
    const nextBtn = document.getElementById('next-btn');
    const seekBar = document.getElementById('seekbar');

    icon = playBtn.querySelector('img');

    let songsList = document
        .getElementById('songList')
        .getElementsByTagName('ul')[0];

    for (const song of songs) {
        let songName = formatSongName(song);

        songsList.innerHTML += `
        <li class="flex justify-between gap-3 items-center border-2 border-gray-500/30 p-2 rounded-xl" data-track="${song}">
            <div class="flex gap-3.5">
                <img src="./svg/musicNote.svg" alt="musicNote" class="h-7">
                <div>${songName}</div>
            </div>
            <img src="./svg/play.svg" alt="play" class="invert h-7">
        </li>
        `;
    }

    // Attach event listener to each song
    Array.from(
        document.getElementById('songList').getElementsByTagName('li')
    ).forEach(element => {
        element.addEventListener('click', () => {
            playMusic(element.dataset.track);
        });
    });

    currentSong.src = `/songs/${songs[0]}`;

    // Play / Pause button
    playBtn.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            icon.src = './svg/pause.svg';
        } else {
            currentSong.pause();
            icon.src = './svg/play.svg';
        }
    });

    currentSong.addEventListener("timeupdate", () => {

    let currentMinutes = Math.floor(currentSong.currentTime / 60);
    let currentSeconds = Math.floor(currentSong.currentTime % 60);

    let durationMinutes = Math.floor(currentSong.duration / 60);
    let durationSeconds = Math.floor(currentSong.duration % 60);

    currentMinutes = String(currentMinutes).padStart(2, "0");
    currentSeconds = String(currentSeconds).padStart(2, "0");

    durationMinutes = String(durationMinutes).padStart(2, "0");
    durationSeconds = String(durationSeconds).padStart(2, "0");

    document.getElementById("songTime").innerText =
        `${currentMinutes}:${currentSeconds} / ${durationMinutes}:${durationSeconds}`;

    // Update seekbar position
    document.getElementById('circle').style.left =
        (currentSong.currentTime / currentSong.duration) * 100 + "%";
});


// Seekbar click
seekBar.addEventListener('click', (e) => {
    let percentage =
        (e.offsetX / e.target.getBoundingClientRect().width) * 100;

    document.getElementById('circle').style.left = percentage + "%";

    currentSong.currentTime =
        (currentSong.duration * percentage) / 100;
});
}

main();