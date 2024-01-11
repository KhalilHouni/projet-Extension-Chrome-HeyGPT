//asking gpt to look up queries on google web browser

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'performGoogleSearch') {
        const query = request.query;
        // Perform the Google search - this can be done using the chrome.tabs API to open a new tab with the search results
        // Example:
        chrome.tabs.create({ url: `https://www.google.com/search?q=${encodeURIComponent(query)}` });
    }
});