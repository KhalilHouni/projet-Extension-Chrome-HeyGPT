import { stopSpeechSynthesis } from "./speechSynthesis.js";

// /// --------------- Google Search Functions --------------- ///

// // Function to check if the user wants to perform a Google search
export function shouldPerformGoogleSearch(userQuestion) {
    return userQuestion.toLowerCase().includes('search on google') && !shouldPerformGoogleImagesSearch(userQuestion);
}

// // Function to perform the Google search with the actual query
export function performGoogleSearch(query) {
    chrome.runtime.sendMessage({ action: 'performGoogleSearch', query: query });
}



// /// --------------- Google Image Search Functions --------------- ///

// // Function to check if the user wants to perform a Google Images search
export function shouldPerformGoogleImagesSearch(userQuestion) {
    return userQuestion.toLowerCase().includes('search on google pictures of');
}

// // Function to perform the Google Images search with the actual query
export function performGoogleImagesSearch(query) {
    const searchKeyword = 'search on google pictures of';
    const searchQuery = query.substring(searchKeyword.length).trim(); // Extract the actual query part after "search on google pictures of"
    stopSpeechSynthesis();
    chrome.runtime.sendMessage({ action: 'performGoogleImagesSearch', query: searchQuery });
}



// /// --------------- Youtube Search Functions --------------- ///

// Function to perform the Youtube search with the actual query
export function performYouTubeSearch(query) {
    chrome.runtime.sendMessage({ action: 'performYouTubeSearch', query: query });
}


// /// --------------- Wikipedia Search Functions --------------- ///

// Function to perform the Wikipedia search with the actual query
export function performWikipediaSearch(query) {
    chrome.runtime.sendMessage({ action: 'performWikipediaSearch', query: query });
}