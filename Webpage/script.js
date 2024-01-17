///////////////////////////////////////////////////////////////

import { stopAudio, 
	startSpeechSynthesis,
	stopSpeechSynthesis } from "./src/speechSynthesis.js";

import { setupMicrophone, 
	toggleMicOff, 
	toggleMicOn, 
	stopMicrophone  } from "./src/speechToText.js";

import { clearConversation, 
	GPT_API_KEY as api_key,
		deleteButton,
		voiceControlCheckbox,
		settingsButton,
		settingsMenu,
		apiKeySaveButton,
		apiKeyInput,
		buttonSend,
		saveToFileButton,
		micCheckbox } from "./src/utils.js";

import { saveUserQuestionsToFile } from './src/saveToFile.js'

import { whatBotMustDo } from "./src/talkWithBot.js";



///////////////////////////////////////////////////////////////


const isApiKeySaved = document.getElementById('isApiKeySaved');





// When the page is loaded check if the API key is saved in local storage
document.addEventListener('DOMContentLoaded', function() {
	if (GPT_API_KEY) {
		isApiKeySaved.style.color = "green";
		isApiKeySaved.textContent = "🟢 API key saved 🟢";
		isApiKeySaved.style.marginLeft = "18px";
	}
});



// --------- Buttons page Functions --------- //


/// ------ Delete Conversation Trigger ------ ///
deleteButton.addEventListener('click', function() {
	stopAudio();
    clearConversation();
});



/// ------ Stop Audio Trigger ------ ///
document.getElementById('stop-audio').addEventListener('click', function() {
    stopAudio();
});



/// ------ Mute Button Trigger ------ ///
voiceControlCheckbox.addEventListener('change', function() {
    isVoiceEnabled = this.checked;
    if (isVoiceEnabled) {
        startSpeechSynthesis();
    } else {
		stopAudio();
        stopSpeechSynthesis();
    }
});


/// ------ Settings Menu Display ------ ///
settingsButton.addEventListener('click', function() {
	console.log(settingsMenu.style.display);
	if (settingsMenu.style.display === 'block') {
    	settingsMenu.style.display = 'none';
	} else {
    	settingsMenu.style.display = 'block';
    }
});


/// ------ Save API Key Trigger ------ ///
apiKeySaveButton.addEventListener('click', function() {
	localStorage.setItem("GPT_API_KEY", apiKeyInput.value);
	apiKeyInput.value = "";
	api_key = localStorage.getItem("GPT_API_KEY");  // change to api_key here
	if (api_key) {
		isApiKeySaved.style.color = "green";
		isApiKeySaved.textContent = "🟢 API key saved 🟢";
		isApiKeySaved.style.marginLeft = "18px";
	} else {
		isApiKeySaved.style.color = "red";
        isApiKeySaved.textContent = "❗️No API Key Saved❗️";
        isApiKeySaved.style.marginLeft = "13px";
	}
});

/// ------ Send to the bot Trigger ------ ///
buttonSend.addEventListener('click', async function() {
	await whatBotMustDo();
});

/// ------ Save To File Trigger ------ ///
saveToFileButton.addEventListener('click', function() {
	saveUserQuestionsToFile()
});


/// ------ Start/Stop record with mic button ------ ///
micCheckbox.addEventListener('click', async function() {
	if (micCheckbox.checked) {
		const recognition2 = await setupMicrophone();
		console.log('Mic is on');
		recognition2.start();
		toggleMicOn();
	} else {
		console.log('Mic is off');
		stopMicrophone();
		toggleMicOff();
	}

	recognition2.onresult = (event) => {
		const result = event.results[event.resultIndex];
		const transcription = result[0].transcript;
		inputQuestion.value = transcription;
	};
	recognition2.onerror = (event) => {
		console.error(event.error);
	};
});

// Function to press the button send with the key enter
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const clickEvent = new Event('click');
        buttonSend.dispatchEvent(clickEvent);
    }
});