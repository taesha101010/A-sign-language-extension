// Function to extract YouTube captions and convert them to ISL letters
async function getCaptions() {
    let video = document.querySelector("video");
    if (!video) {
        console.log("No video found.");
        return;
    }

    let tracks = video.textTracks;
    if (!tracks || tracks.length === 0) {
        console.log("No captions available.");
        return;
    }

    for (let track of tracks) {
        if (track.kind === "subtitles" || track.kind === "captions") {
            track.mode = "hidden"; // Ensure the track is enabled but not visible
            track.oncuechange = function () {
                let cue = track.activeCues ? track.activeCues[0] : null;
                if (cue) {
                    console.log("Caption:", cue.text);
                    showISLTranslation(cue.text); // Call function to display ISL letters
                }
            };
        }
    }
}

// Map letters to ISL images (JPEG format)
const islAlphabetMap = {};
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
letters.split("").forEach(letter => {
    islAlphabetMap[letter] = chrome.runtime.getURL(`ASL_LETTERS/${letter}.jpeg`);
});

// Function to display ISL letters for the given text
function showISLTranslation(text) {
    let container = document.getElementById("isl-container");
    
    // If the container does not exist, create one
    if (!container) {
        container = document.createElement("div");
        container.id = "isl-container";
        container.style.position = "fixed";
        container.style.bottom = "20px";
        container.style.right = "20px";
        container.style.background = "white";
        container.style.padding = "10px";
        container.style.borderRadius = "10px";
        container.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
        container.style.display = "flex";
        document.body.appendChild(container);
    }

    // Clear previous letters
    container.innerHTML = "";

    // Convert text to uppercase and display corresponding ISL images
    for (let char of text.toUpperCase()) {
        if (islAlphabetMap[char]) {
            let img = document.createElement("img");
            img.src = islAlphabetMap[char];
            img.style.width = "50px";  // Adjust size as needed
            img.style.margin = "5px";
            container.appendChild(img);
        }
    }
}

// Observe changes in the DOM to detect video presence
const observer = new MutationObserver((mutations, observer) => {
    if (document.querySelector("video")) {
        observer.disconnect(); // Stop observing once video is found
        getCaptions(); // Start extracting captions
    }
});

// Start observing changes in the DOM
observer.observe(document.body, { childList: true, subtree: true });

// Also run on page load
document.addEventListener("DOMContentLoaded", getCaptions);
