import { clearConversation, 
	appendToConversation,
	createGptTag,
	createErrorMessage, 
	createUserQuestion,
	createUserTag, GPT_API_KEY,
	inputQuestion,
	createLookingMessage } from "./utils.js";

import { shouldPerformGoogleSearch,
		performGoogleSearch,
		shouldPerformGoogleImagesSearch,
		performGoogleImagesSearch,
		performWikipediaSearch
	} from "./webSearch.js"

import { getWeatherInfo, createWeatherAnswer } from "./weather.js";
import { triggerChatGPT } from "./gpt.js";
import { stopSpeechSynthesis } from "./speechSynthesis.js";

// ---------- Talk To The Bot Functions ---------- //

let convLog = [];

function saveToLog(user, content) {
	convLog.push({user: user, content: content});
  }

export async function whatBotMustDo() {
	clearConversation();
	if (GPT_API_KEY === "" || !GPT_API_KEY) {
		triggerErrorApiKeyUndifined();
	} else {
	const userQuestion = inputQuestion.value;
        saveToLog('User', userQuestion);
		
		if (userQuestion) {
			if (shouldPerformGoogleSearch(userQuestion)) {
				// Respond with "looking on the browser..."
				const lookingMessage = createLookingMessage();
				appendToConversation(lookingMessage);
				saveToLog('Bot', 'Looking on the browser...');

				// Disable ChatGPT
				stopSpeechSynthesis();

				// Perform the Google search
				performGoogleSearch(userQuestion);
			} else if (shouldPerformGoogleImagesSearch(userQuestion)) {
				// Respond with "looking on the browser..."
				const lookingMessage = createLookingMessage();
				appendToConversation(lookingMessage);
				saveToLog('Bot', 'Looking on the browser...');

				// Disable ChatGPT
				stopSpeechSynthesis();

				// Perform the Google Images search
				performGoogleImagesSearch(userQuestion);
			} else if (userQuestion.toLowerCase().includes('search on youtube')) {
				const query = userQuestion.replace('search on youtube', '').trim();
				// Perform the YouTube search
				chrome.runtime.sendMessage({ action: 'performYouTubeSearch', query: query });
			} else if (userQuestion.toLowerCase().includes('search on wikipedia')) {
                const query = userQuestion.replace('search on wikipedia', '').trim();
                // Perform the Wikipedia search
                performWikipediaSearch(query);
				
            } else if (
                userQuestion.toLowerCase().includes("weather") ||
                userQuestion.toLowerCase().includes("clima") ||
                userQuestion.includes("天气") ||
                userQuestion.includes("الطقس") ||
                userQuestion.toLowerCase().includes("météo")
            ) {
                const location = extractLocationFromQuestion();
                getWeatherInfo(location);
			} else { 
				triggerChatGPT(userQuestion); // make sure to save bot response here using saveToLog('Bot', response);
			}
		
		} else {
			const errorMessage = "An Error has occured. Please try again.";
			const gptTag = createGptTag();
			appendToConversation(gptTag);
			appendToConversation(errorMessage);
			saveToLog('Bot', errorMessage);
		}
	}
	countUserquestion();
};

function triggerErrorApiKeyUndifined() {
	const errorMessage = createErrorMessage("You need to save your API key in the settings menu before you can talk to the bot.");
	const userTag = createUserTag();
	const gptTag = createGptTag();
	const userQuestion = createUserQuestion(inputQuestion.value);
	appendToConversation(userTag);
	appendToConversation(userQuestion);
	appendToConversation(gptTag);
	appendToConversation(errorMessage);
	setTimeout(function () {
		console.log(settingsMenu.style.display);
		if (settingsMenu.style.display !== 'block') {
			settingsMenu.style.display = 'block';
		}
	}, 1000);
}

// Counter to track the number of questions asked
let questionCounter = 0;

function countUserquestion() {
	questionCounter++;

	// Log the user question in the console
	console.log(`User Question ${questionCounter}: ${inputQuestion.value}`);

	if (questionCounter % 3 === 0) {
		// Clear the console after every third question
		console.clear();
	}
}


export function extractLocationFromQuestion() {
    // Implement the logic to extract the location from the user's input
    // For example, you could use a regular expression to extract the location from the user's question
    // This is a placeholder example and should be replaced with your actual implementation
    const locationRegex = /weather\s+in\s+(.*)/i; // Regular expression to match "weather in {location}"
    const match = inputQuestion.value.match(locationRegex);
    if (match) {
        // The location is captured in the first group of the match
        return match[1];
    } else {
        // If the location is not found, you may return a default location or handle the situation accordingly
        return "defaultLocation"; // Replace "defaultLocation" with the default location value
    }
}