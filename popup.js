document.getElementById("start").addEventListener("click", () => {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";

    recognition.onresult = async (event) => {
        let speechText = event.results[0][0].transcript;
        console.log("Recognized Speech:", speechText);
        translateTextToSign(speechText);
    };
    
    recognition.start();
});

async function translateTextToSign(text) {
    let signVideoURL = await getSignLanguageVideo(text);
    document.getElementById("signVideo").src = signVideoURL;
}

async function getSignLanguageVideo(text) {
    let apiUrl = `https://signall-api.com/translate?text=${encodeURIComponent(text)}`;
    let response = await fetch(apiUrl);
    let data = await response.json();
    return data.videoUrl;
}
