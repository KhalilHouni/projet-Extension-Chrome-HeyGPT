export const convArea = document.getElementById('conv');

export const buttonSend = document.getElementById('button-send');
export const inputQuestion = document.getElementById('user-question');

export const voiceControlCheckbox = document.getElementById('voice-control-checkbox');
export const deleteButton = document.getElementById('delete-button');

export const micCheckbox = document.getElementById('mic-checkbox');

export const saveToFileButton = document.getElementById('saveToFile');

export const settingsButton = document.getElementById('settingsButton');
export const settingsMenu = document.getElementById('settingsMenu');
export const apiKeySaveButton = document.getElementById('apiKeySave');
export const apiKeyInput = document.getElementById('apiKeyInput');

export const micSwitch = document.getElementById('switch');
export const micOn = document.getElementById('mic-on');

export let GPT_API_KEY = localStorage.getItem('GPT_API_KEY');
export let isVoiceEnabled = true;
export let recognition;
export let lastUserQuestion;

export function modifyLastUserQuestion(value) {
	lastUserQuestion = value;
}

export function modifyGptApiKey(value) {
    GPT_API_KEY = value;
}

export function modifyIsVoiceEnabled() { 
	isVoiceEnabled = isVoiceEnabled? false : true; 
}

export function defineRecognition() {
	recognition = new webkitSpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.interimResults = true;
    recognition.continuous = false;
}

// /// --------------- Global Functions --------------- ///

// // Function to create "looking on the browser..." message
export function createLookingMessage() {
    const lookingMessage = document.createElement('p');
    lookingMessage.textContent = "Looking on the browser...";
    return lookingMessage;
}

// // Append in conv area error message
export function createErrorMessage(message) {
	const errorMessage = document.createElement('p');
	errorMessage.textContent = message;
	return errorMessage;
}

// // Function to create user tag
export function createUserTag() {
    const userTag = document.createElement('h4');
    userTag.textContent = 'User';
    return userTag;
}

// // Function to create user question element
export function createUserQuestion(userInput) {
    const userQuestion = document.createElement('p');
    userQuestion.textContent = userInput;
	modifyLastUserQuestion(userInput);
    inputQuestion.value = "";
    return userQuestion;
}

// // Function to create Hey GPT tag
export function createGptTag() {
    const gptTag = document.createElement('h4');
    gptTag.textContent = 'Hey GPT';
    return gptTag;
}

// // Function to append element to conversation area
export function appendToConversation(element) {
    convArea.appendChild(element);
}

// // Function to scroll to the bottom of the conversation area
export function scrollToBottom() {
    convArea.scrollTop = convArea.scrollHeight;
}

// // Function to clear conversation
export function clearConversation() {
    convArea.innerHTML = "";
	modifyLastUserQuestion("");
}