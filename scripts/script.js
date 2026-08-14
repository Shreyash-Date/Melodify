async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();

    let div = document.createElement("div")
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

let audio;

async function main() {
    let songs = await getSongs();
    const previousBtn = document.getElementById('previous-btn');
    const playBtn = document.getElementById('play-btn');
    const nextBtn = document.getElementById('next-btn');
    const seekBar = document.getElementById('seekBar');

    // Displayed Song on the web screen
    let songsList = document.getElementById('songList').getElementsByTagName('ul')[0];
    for (const song of songs) {
        // songsList.innerHTML = songsList.innerHTML + `<li> ${song.replace(/-no\d+-.*\.mp3$/, "").replaceAll("-", " ").replace("free", " ").replace("neffex", " ").replace("copyright", " ")}</li>`;

        let songName = song
            .replace(/-no\d+-.*\.mp3$/, "")
            .replaceAll("-", " ")
            .replace("free", "")
            .replace("neffex", "")
            .replace("copyright", "");

        songsList.innerHTML += `
        <li class="flex justify-between gap-3 items-center border-2 border-gray-500/30 p-2 rounded-xl">
            <div class="flex gap-3.5">
                <img src="./svg/musicNote.svg" alt="musicNote" class="h-7">
                <div>${songName}</div>
            </div>
            <img src="./svg/play.svg" alt="play" class="invert h-7">
        </li>
    `;
    }



    audio = new Audio(`songs/${songs[0]}`);
    // audio.play();

    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration;
        console.log(audio.duration, audio.currentSrc, audio.currentTime);
    });

}

main();

