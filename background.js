//asking gpt to look up queries on google web browser
// Listen for messages from the popup script to do google images search
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'performGoogleImagesSearch') {
        const query = request.query;
        // Perform the Google Images search using the actual query
        chrome.tabs.create({ url: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}` });
    }
});

// Listen for messages from the popup script to do google search
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'performGoogleSearch') {
        const query = request.query;
        // Perform the Google search using the actual query
        const modifiedQuery = query.replace('search on google', '').trim(); // Exclude the keyword "search on google" from the search query
        chrome.tabs.create({ url: `https://www.google.com/search?q=${encodeURIComponent(modifiedQuery)}` });
    }
});




chrome.runtime.onInstalled.addListener(function(details) {
    console.log("onInstalled event triggered", details);
    if (details.reason === "install") {
        chrome.tabs.create({
            url: chrome.runtime.getURL("/Webpage/index.html")
        });
    }
});


chrome.tabCapture.capture({ audio: true }, (stream) => {
	// Continue to play the captured audio to the user.
	console.log("prout");
	const output = new AudioContext();
	const source = output.createMediaStreamSource(stream);
	source.connect(output.destination);
	console.log(source);
	// TODO: Do something with the stream (e.g record it)
});

