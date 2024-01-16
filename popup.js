const buttonSend = document.getElementById('button-send');
const inputQuestion = document.getElementById('user-question');
const convArea = document.getElementById('conv');
const voiceControlCheckbox = document.getElementById('voice-control-checkbox');
const deleteButton = document.getElementById('delete-button');
const micSwitch = document.getElementById('switch');
const micOn = document.getElementById('mic-on');
const micCheckbox = document.getElementById('mic-checkbox');

const saveToFileButton = document.getElementById('saveToFile');
const settingsButton = document.getElementById('settingsButton');
const settingsMenu = document.getElementById('settingsMenu');
const apiKeySaveButton = document.getElementById('apiKeySave');
const apiKeyInput = document.getElementById('apiKeyInput');

const URL = 'https://api.openai.com/v1/completions';
const weatherApiKey = "23e05a7ea147f7645052bf0de2fd3fa3";
const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

var synthesis;
var recognition;
var microphone;
var audioContext;
var lastUserQuestion;
var GPT_API_KEY = localStorage.getItem('GPT_API_KEY');
var isVoiceEnabled = true; // Set bot's voice to "on" by default



// ------ On load actions ------ //

const isApiKeySaved = document.getElementById('isApiKeySaved');



// When the page is loaded print welcome message
document.addEventListener('DOMContentLoaded', function() {
    var welcome = document.createElement('p');
	welcome.textContent = "Welcome, I am Hey GPT. Ask me any question, either orally or textually, I will provide the best answer. By default I will answer you with speech synthesis, you can disable that below with mute button, moreover you can choose the language of your choice for TTS with the languages menu. I can tell yout the actual weather in any city in the world, use : \'weather\' + city name. Also, I can do Google or Youtube search with : \'search on google(or youtube)\' + your search, or \'search on google pictures of\' + your search, for images search. I was made with ❤️ by Khalil, Maud, and Rémy.";
	var gptTag = createGptTag();
	convArea.appendChild(gptTag);
	convArea.appendChild(welcome);

	if (GPT_API_KEY) {
		isApiKeySaved.style.color = "green";
		isApiKeySaved.textContent = "🟢 API key saved";
		isApiKeySaved.style.marginLeft = "20px";
	}
});


// --------- Buttons PopUP Functions --------- //


// When the mic checkbox is check scale it
micSwitch.addEventListener('click', async function() {
	toggleMic( () => {
		chrome.tabs.create({
			url: chrome.runtime.getURL("/Webpage/index.html")
		});
	})
});

// Mic button style change on click
function toggleMic(callback) {
	micSwitch.style.backgroundColor = "red";
	micOn.style.transform = "scale(1.3)";
	setTimeout(function() {
		micSwitch.style.backgroundColor = "black";
        micOn.style.transform ='scale(1)';
		callback();
	}, 700);
}

// Function to delete conversation when delete button is clicked
deleteButton.addEventListener('click', function() {
	stopAudio();
    clearConversation();
});

// Function to clear conversation
function clearConversation() {
    convArea.innerHTML = "";
}

// Event listener for stop audio button
document.getElementById('stop-audio').addEventListener('click', function() {
    stopAudio();
});

// Function to stop the audio
function stopAudio() {
    window.speechSynthesis.cancel();
}

// Event listener for voice control checkbox
voiceControlCheckbox.addEventListener('change', function() {
    isVoiceEnabled = this.checked;
    if (isVoiceEnabled) {
        startSpeechSynthesis();
    } else {
        stopSpeechSynthesis();
    }
});

// Function to press the button send with the key enter
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const clickEvent = new Event('click');
        buttonSend.dispatchEvent(clickEvent);
    }
});

// Settings menu button display on click
settingsButton.addEventListener('click', function() {
	if (settingsMenu.style.display === 'block') {
    	settingsMenu.style.display = 'none';
	} else {
    	settingsMenu.style.display = 'block';
    }
});

// Event listener for save API key button
apiKeySaveButton.addEventListener('click', function() {
	if (!apiKeyInput.value) {
		return;
	} else {
		localStorage.setItem("GPT_API_KEY", apiKeyInput.value);
		apiKeyInput.value = "";
		GPT_API_KEY = localStorage.getItem("GPT_API_KEY");
		isApiKeySaved.style.color = "green";
		isApiKeySaved.textContent = "🟢 API key saved";
		isApiKeySaved.style.marginLeft = "20px";
	}
});

// Function to press the button send with the key enter
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const clickEvent = new Event('click');
        buttonSend.dispatchEvent(clickEvent);
    }
});

// -------- Speech Synthesis Functions -------- //

function startSpeechSynthesis() {
    if (!synthesis) {
        synthesis = new webkitSpeechsynthesis();
        synthesis.continuous = false;
        synthesis.lang = "fr-FR";
        synthesis.onresult = function(event) {
            const speechToText = event.results[0][0].transcript;
            inputQuestion.value = speechToText;
            triggerChatGPT(speechToText);
        };
    }
    synthesis.start();
}

function stopSpeechSynthesis() {
    if (synthesis) {
        synthesis.stop();
    }
}

// Function to play bot's response as speech with the selected language
function playBotResponse(responseText, language) {
    const languageConfig = {
        fr: 'fr-FR',
        en: 'en-US',
        es: 'es-ES',
        zh: 'cmn-Hans-CN', // Mandarin
        ar: 'ar-SA',      // Arabic
        pt: 'pt-PT'       // Portuguese
      // more languages can be added here
    };

    const selectedLanguage = languageConfig[language] || 'en-US'; // Default to English if language is not found

    const utterance = new SpeechSynthesisUtterance(responseText);
    utterance.lang = selectedLanguage; // Set the language for the speech synthesis
    window.speechSynthesis.speak(utterance);
}



// ---------- Talk To The Bot Functions ---------- //

// Event listener for send button
buttonSend.addEventListener('click', async function() {
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
			} else if (userQuestion.includes("weather")) {
				const location = userQuestion.replace("weather", "").trim();
				const weatherData = await getWeatherInfo(location);
				const weatherMessage = createWeatherAnswer(weatherData);
				const gptTag = createGptTag();
				appendToConversation(gptTag);
				appendToConversation(weatherMessage);
			} else { 
				triggerChatGPT(userQuestion);
			}
		} else {
			const errorMessage = createErrorMessage("An Error has occured. Please try again.");
			const gptTag = createGptTag();
			appendToConversation(gptTag);
			appendToConversation(errorMessage);
		}
	}
	countUserquestion();
});

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


/// --------------- Google Search Functions --------------- ///

// Function to check if the user wants to perform a Google search
function shouldPerformGoogleSearch(userQuestion) {
    return userQuestion.toLowerCase().includes('search on google') && !shouldPerformGoogleImagesSearch(userQuestion);
}

// Function to perform the Google search with the actual query
function performGoogleSearch(query) {
    chrome.runtime.sendMessage({ action: 'performGoogleSearch', query: query });
}

// Function to check if the user wants to perform a Google Images search
function shouldPerformGoogleImagesSearch(userQuestion) {
    return userQuestion.toLowerCase().includes('search on google pictures of');
}

// Function to perform the Google Images search with the actual query
function performGoogleImagesSearch(query) {
    const searchKeyword = 'search on google pictures of';
    const searchQuery = query.substring(searchKeyword.length).trim(); // Extract the actual query part after "search on google pictures of"
    stopSpeechSynthesis();
    chrome.runtime.sendMessage({ action: 'performGoogleImagesSearch', query: searchQuery });
}

// Function to create "looking on the browser..." message
function createLookingMessage() {
    const lookingMessage = document.createElement('p');
    lookingMessage.textContent = "Looking on the browser...";
    return lookingMessage;
}

// Append in conv area error message
function createErrorMessage(message) {
	const errorMessage = document.createElement('p');
	errorMessage.textContent = message;
	return errorMessage;
}




/// --------------- WeatherApi Functions --------------- ///

async function getWeatherInfo(location) {
    return await fetch(`${weatherApiUrl}${location}&appid=${weatherApiKey}`)
        .then(response => response.json())
        .then(data => {
            const weatherDescription = data.weather[0].description;
            const temperature = data.main.temp;
        	const weatherInfo = `Weather in ${location}: ${weatherDescription}, Temperature: ${temperature}°C`;
			console.log(weatherInfo);
			return weatherInfo;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}


function createWeatherAnswer(weatherData) {
	const answerWeather = document.createElement('p');
	answerWeather.textContent = weatherData;
	return answerWeather;
}


/// --------------- ChatGPT Functions --------------- ///

// Function to trigger ChatGPT with user's input and selected language
async function triggerChatGPT(userInput) {
    clearConversation();

    const userTag = createUserTag();
    const userQuestion = createUserQuestion(userInput);
    const gptTag = createGptTag();

    appendToConversation(userTag);
    appendToConversation(userQuestion);
    appendToConversation(gptTag);

    const language = document.getElementById('language-select').value; // Get the selected language

    const gptAnswer = await askQuestion(userInput, language);
    appendToConversation(gptAnswer);
    if (isVoiceEnabled) {
        playBotResponse(gptAnswer.textContent, language); // Pass the selected language to the playBotResponse function
    }
    scrollToBottom();
}


// Function to create user tag
function createUserTag() {
    const userTag = document.createElement('h4');
    userTag.textContent = 'User';
    return userTag;
}

// Function to create user question element
function createUserQuestion(userInput) {
    const userQuestion = document.createElement('p');
    userQuestion.textContent = userInput;
	lastUserQuestion = userInput;
    inputQuestion.value = "";
    return userQuestion;
}

// Function to create Hey GPT tag
function createGptTag() {
    const gptTag = document.createElement('h4');
    gptTag.textContent = 'Hey GPT';
    return gptTag;
}

// Function to append element to conversation area
function appendToConversation(element) {
    convArea.appendChild(element);
}

// Function to scroll to the bottom of the conversation area
function scrollToBottom() {
    convArea.scrollTop = convArea.scrollHeight;
}

// Function to call ChatGPT's API to ask the user question
async function askQuestion(userQuestion) {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GPT_API_KEY}`,
    };

    const body = JSON.stringify({
        model: 'gpt-3.5-turbo-instruct',
        prompt: `${userQuestion}`,
        temperature: 0.5,
        max_tokens: 150,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
    });

    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: headers,
            body: body,
        });

        const answer = await createAnswerGpt(response);
        return answer;
    } catch (error) {
        console.error('Error calling ChatGPT API:', error);
        return null;
    }
}

// Function to create bot's response element
async function createAnswerGpt(response) {
    const data = await response.json();
    const answer = document.createElement('p');
    answer.textContent = data.choices[0].text;
    return answer;
}



/// --------------- Save To File Functions --------------- ///


// Event listener for the "Save to File" button
saveToFileButton.addEventListener('click', function() {
	saveUserQuestionsToFile()
});

// Function to log the user question in the console and save it to a .txt file
function saveUserQuestionsToFile() {

    if (lastUserQuestion) {
        // Create a Blob containing the user question as a .txt file
        const blob = new Blob([lastUserQuestion], { type: 'text/plain' });

        // Use FileReader to read the Blob as a data URL
        const reader = new FileReader();
        reader.onload = function(event) {
            // Create a download link for the .txt file
            const downloadLink = document.createElement('a');
            downloadLink.download = 'user_question.txt';
            downloadLink.href = event.target.result;
            downloadLink.click();
        };
        reader.readAsDataURL(blob);
		lastUserQuestion = "";
    } else {
        console.error('No user question found to save.');
    }
}