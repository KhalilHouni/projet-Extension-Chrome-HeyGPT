//asking gpt to look up queries on google web browser


// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'performGoogleImagesSearch') {
        const query = request.query;
        // Perform the Google Images search using the actual query
        chrome.tabs.create({ url: `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}` });
    }
});

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'performGoogleSearch') {
        const query = request.query;
        // Perform the Google search using the actual query
        const modifiedQuery = query.replace('search on google', '').trim(); // Exclude the keyword "search on google" from the search query
        chrome.tabs.create({ url: `https://www.google.com/search?q=${encodeURIComponent(modifiedQuery)}` });
    }
});


