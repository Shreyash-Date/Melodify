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

async function main() {
    let songs = await getSongs();    

    // Displayed Song on the web screen
    let songsList = document.getElementById('songList').getElementsByTagName('ul')[0];
    for (const song of songs) {
        songsList.innerHTML = songsList.innerHTML + `<li> ${song.replace(/-no\d+-.*\.mp3$/, "").replaceAll("-", " ").replace("free", " ").replace("neffex", " ").replace("copyright", " ")}</li>`;
    }

    let audio = new Audio(songs[0]);
    // audio.play();

    audio.addEventListener("loadeddata", () =>{
        let duration = audio.duration;
        console.log(audio.duration, audio.currentSrc, audio.currentTime);
    });
}
main();