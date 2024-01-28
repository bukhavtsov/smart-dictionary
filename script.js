async function translateWord() {
    const wordInput = document.getElementById("wordInput").value;

    const translationContainer = document.getElementById("translationContainer");
    translationContainer.innerHTML = "<p>Loading...</p>";

    try {
        const response = await fetch("http://localhost:8080/translations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ word: wordInput }),
        });

        const responseData = await response.json();

        if (response.ok) {
            displayTranslation(responseData);
        } else {
            translationContainer.innerHTML = `<p>Error: ${responseData.message}</p>`;
        }
    } catch (error) {
        translationContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    }
    onYouglishAPIReady(wordInput)
}

function displayTranslation(translation) {
    const translationContainer = document.getElementById("translationContainer");

    const html = `
        <p>Meaning: ${translation.meaning}</p>
        <p>Examples: ${translation.examples.join(", ")}</p>
        <p>Russian Translation: ${translation.russianTranslation}</p>
        <p>Meaning in Russian: ${translation.meaningRussian}</p>
        <p>Examples in Russian: ${translation.examplesRussian.join(", ")}</p>
    `;

    translationContainer.innerHTML = html;
}

document.getElementById('downloadButton').addEventListener('click', function() {
    // Trigger the download by making a request to the server endpoint
    fetch('http://localhost:8080/translations/download')
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'translations.txt';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error downloading translations:', error));
});



// 2. This code loads the widget API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://youglish.com/public/emb/widget.js";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates a widget after the API code downloads.
var widget;
function onYouglishAPIReady(wordInput){
    widget = new YG.Widget("widget-1", {
        width: 640,
        components:9, //search box & caption
        events: {
            'onFetchDone': onFetchDone,
            'onVideoChange': onVideoChange,
            'onCaptionConsumed': onCaptionConsumed
        }
    });
    // 4. process the query
    widget.fetch(wordInput);
}


var views = 0, curTrack = 0, totalTracks = 0;

// 5. The API will call this method when the search is done
function onFetchDone(event){
    if (event.totalResult === 0)   alert("No result found");
    else totalTracks = event.totalResult;
}

// 6. The API will call this method when switching to a new video.
function onVideoChange(event){
    curTrack = event.trackNumber;
    views = 0;
}

// 7. The API will call this method when a caption is consumed.
function onCaptionConsumed(event){
    // if (++views < 3)
    //     widget.replay();
    // else
    if (curTrack < totalTracks)
        widget.next();
}
