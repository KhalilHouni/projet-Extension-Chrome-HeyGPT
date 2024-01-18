// Asking GPT to look up queries on Google web browser
// Listen for messages from the popup script to do Google Images search
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'performGoogleImagesSearch') {
        const query = request.query;
        // Perform the Google Images search using the actual query
        chrome.tabs.create({ url: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}` });
    }
});

// Listen for messages from the popup script to do Google search
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'performGoogleSearch') {
        const query = request.query;
        // Perform the Google search using the actual query
        const modifiedQuery = query.replace('search on google', '').trim(); // Exclude the keyword "search on google" from the search query
        chrome.tabs.create({ url: `https://www.google.com/search?q=${encodeURIComponent(modifiedQuery)}` });
    }
});

// Listen for messages from the popup script to do YouTube search
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'performYouTubeSearch') {
        const query = request.query;
        // Perform the YouTube search using the actual query
        chrome.tabs.create({ url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}` });
    }
});

// Listen for messages from the popup script to do Wikipedia search
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'performWikipediaSearch') {
        const query = request.query;
        // Perform the Wikipedia search using the actual query
        chrome.tabs.create({ url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}` });
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

