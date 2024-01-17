///////////////////////////////////////////////////////////////

import { stopAudio, 
		startSpeechSynthesis, 
		stopSpeechSynthesis } from "./src/speechSynthesis.js";

import { toggleRecognition  } from "./src/speechToText.js";

import { buttonSend,
		micCheckbox,
		clearConversation,
		deleteButton,
		GPT_API_KEY,
		voiceControlCheckbox,
		isVoiceEnabled,
		modifyIsVoiceEnabled } from "./src/utils.js";

// import { saveUserQuestionsToFile } from './src/saveToFile.js'

// import { whatBotMustDo } from "./src/talkWithBot.js";



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
	modifyIsVoiceEnabled();
	console.log(isVoiceEnabled);
    if (isVoiceEnabled) {
        startSpeechSynthesis();
    } else {
		stopAudio();
        stopSpeechSynthesis();
    }
});


/// ------ Settings Menu Display ------ ///
// settingsButton.addEventListener('click', function() {
// 	console.log(settingsMenu.style.display);
// 	if (settingsMenu.style.display === 'block') {
//     	settingsMenu.style.display = 'none';
// 	} else {
//     	settingsMenu.style.display = 'block';
//     }
// });


/// ------ Save API Key Trigger ------ ///
// apiKeySaveButton.addEventListener('click', function() {
// 	localStorage.setItem("GPT_API_KEY", apiKeyInput.value);
// 	apiKeyInput.value = "";
// 	GPT_API_KEY = localStorage.getItem("GPT_API_KEY");  // change to api_key here
// 	if (GPT_API_KEY) {
// 		isApiKeySaved.style.color = "green";
// 		isApiKeySaved.textContent = "🟢 API key saved 🟢";
// 		isApiKeySaved.style.marginLeft = "18px";
// 	} else {
// 		isApiKeySaved.style.color = "red";
//         isApiKeySaved.textContent = "❗️No API Key Saved❗️";
//         isApiKeySaved.style.marginLeft = "13px";
// 	}
// });

/// ------ Send to the bot Trigger ------ ///
// buttonSend.addEventListener('click', async function() {
// 	await whatBotMustDo();
// });

/// ------ Save To File Trigger ------ ///
// saveToFileButton.addEventListener('click', function() {
// 	saveUserQuestionsToFile()
// });


/// ------ Start/Stop record with mic button ------ ///

micCheckbox.addEventListener('click', async function() {
	await toggleRecognition();
});

// Function to press the button send with the key enter
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const clickEvent = new Event('click');
        buttonSend.dispatchEvent(clickEvent);
    }
});