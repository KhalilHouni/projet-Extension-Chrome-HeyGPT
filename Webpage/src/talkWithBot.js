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
		performWikipediaSearch } from "./webSearch.js"

import { getWeatherInfo, createWeatherAnswer, 
	containWeatherWord } from "./weather.js";

import { triggerChatGPT, setSelectedLanguage } from "./gpt.js";
import { stopSpeechSynthesis, playBotResponse } from "./speechSynthesis.js";


// ---------- Talk To The Bot Functions ---------- //
export async function whatBotMustDo() {
	clearConversation();
	if (GPT_API_KEY === "" || !GPT_API_KEY) {
		triggerErrorApiKeyUndifined();
	} else {
		const userQuestion = inputQuestion.value;
		if (userQuestion) {
			if (shouldPerformGoogleSearch(userQuestion)) {
				// Respond with "looking on the browser..."
				const lookingMessage = createLookingMessage();
				appendToConversation(lookingMessage);

				// Disable ChatGPT
				stopSpeechSynthesis();

				// Perform the Google search
				performGoogleSearch(userQuestion);
			} else if (shouldPerformGoogleImagesSearch(userQuestion)) {
				// Respond with "looking on the browser..."
				const lookingMessage = createLookingMessage();
				appendToConversation(lookingMessage);

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
                performWikipediaSearch(query);} else if (containWeatherWord(userQuestion)) {

				const language = document.getElementById('language-select').value; // Get the selected language

                const location = extractLocationFromQuestion();
				const weatherData = await getWeatherInfo(location);

				const userTag = createUserTag();
                const userWeatherAsk = createUserQuestion(userQuestion);
				const gptTag = createGptTag();
				const weatherMessage = createWeatherAnswer(weatherData);

				appendToConversation(userTag);
				appendToConversation(userWeatherAsk);
				appendToConversation(gptTag);
				appendToConversation(weatherMessage);

				setSelectedLanguage(language);
				playBotResponse(weatherMessage.textContent, language); 
			} else {
				await triggerChatGPT(userQuestion);
			}
		} else {
			const errorMessage = createErrorMessage("An Error has occured. Please try again.");
			const gptTag = createGptTag();
			appendToConversation(gptTag);
			appendToConversation(errorMessage);
		}
		countUserquestion();
	}
}

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

function extractLocationFromQuestion() {
    let locationSp = inputQuestion.value.split(' ');
    let locationFin= locationSp[locationSp.length - 1];
    console.log(locationFin);
    return locationFin
}