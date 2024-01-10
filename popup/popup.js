const buttonSend = document.getElementById('button-send');
const inputQuestion = document.getElementById('user-question');
const convArea = document.getElementById('conv');
const deleteButton = document.getElementById('delete-button');
const API_KEY = 'API_KEY';
const URL = 'https://api.openai.com/v1/completions';
let recognition;
let isVoiceEnabled = true; // Set bot's voice to "off" by default

const voiceControlCheckbox = document.getElementById('voice-control-checkbox');

// When the page is loaded print welcome message
document.addEventListener('DOMContentLoaded', function() {
    var welcome = document.createElement('p');
    welcome.textContent = "Bienvenue, je suis Hey GPT. Posez moi n'importe quelle question, oralement ou textuellement avec les boutons dédiés en dessous. Je ferais la meilleure réponse possible. J'ai été fait avec ❤️ par Khalil, Maud et Rémy.";
	var gptTag = createGptTag();
	convArea.appendChild(gptTag);
	convArea.appendChild(welcome);
});


// Event listener for voice control checkbox
voiceControlCheckbox.addEventListener('change', function() {
    isVoiceEnabled = this.checked;
    if (isVoiceEnabled) {
        startSpeechRecognition();
    } else {
        stopSpeechRecognition();
    }
});



function startSpeechRecognition() {
    if (!recognition) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.lang = "en-US";
        recognition.onresult = function(event) {
            const speechToText = event.results[0][0].transcript;
            inputQuestion.value = speechToText;
            triggerChatGPT(speechToText);
        };
    }
    recognition.start();
}

function stopSpeechRecognition() {
    if (recognition) {
        recognition.stop();
    }
}

// Start speech recognition
function startSpeechRecognition() {
    recognition.start();
    recognition.onresult = function(event) {
        const speechToText = event.results[0][0].transcript;
        inputQuestion.value = speechToText;
        triggerChatGPT(speechToText);
    };
}

// Stop speech recognition
function stopSpeechRecognition() {
    recognition.stop();
}

// Event listener for send button
buttonSend.addEventListener('click', function() {
    const userQuestion = inputQuestion.value;
    if (userQuestion) {
        triggerChatGPT(userQuestion);
    }
});

// Function to trigger ChatGPT with user's input
async function triggerChatGPT(userInput) {
    clearConversation();

    const userTag = createUserTag();
    const userQuestion = createUserQuestion(userInput);
    const gptTag = createGptTag();

    appendToConversation(userTag);
    appendToConversation(userQuestion);
    appendToConversation(gptTag);

    const gptAnswer = await askQuestion(userInput);
    appendToConversation(gptAnswer);
    if (isVoiceEnabled) {
        playBotResponse(gptAnswer.textContent);
    }
    scrollToBottom();
}

// Event listener for stop audio button
document.getElementById('stop-audio').addEventListener('click', function() {
    stopAudio();
});

// Function to stop the audio
function stopAudio() {
    window.speechSynthesis.cancel();
}

// Function to clear conversation
function clearConversation() {
    convArea.innerHTML = "";
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
        'Authorization': `Bearer ${API_KEY}`,
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

// Function to play bot's response as speech
function playBotResponse(responseText) {
    const utterance = new SpeechSynthesisUtterance(responseText);
    window.speechSynthesis.speak(utterance);
}

// Function to delete conversation when delete button is clicked
deleteButton.addEventListener('click', function() {
    convArea.innerHTML = "";
});