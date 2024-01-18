///////////////////////////////////////////////////////////////

import { stopAudio, 
		startSpeechSynthesis, 
		stopSpeechSynthesis } from "./src/speechSynthesis.js";

import { buttonSend, micSwitch, micOn,
		clearConversation, deleteButton,
		GPT_API_KEY, voiceControlCheckbox,
		isVoiceEnabled, modifyIsVoiceEnabled,
		settingsButton, settingsMenu,
		apiKeySaveButton, apiKeyInput,
		saveToFileButton, modifyGptApiKey} from "./src/utils.js";

import { saveUserQuestionsToFile } from './src/saveToFile.js'

import { whatBotMustDo } from "./src/talkWithBot.js";

///////////////////////////////////////////////////////////////


const isApiKeySaved = document.getElementById('isApiKeySaved');




// When the page is loaded check if the API key is saved in local storage
document.addEventListener('DOMContentLoaded', function() {
	if (GPT_API_KEY) {
		isApiKeySaved.style.color = "green";
		isApiKeySaved.textContent = "🟢 API key saved";
		isApiKeySaved.style.marginLeft = "18px";
	}
	initializeLanguage();
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
settingsButton.addEventListener('click', function() {
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
	modifyGptApiKey(localStorage.getItem("GPT_API_KEY"));  // change to api_key here
	if (GPT_API_KEY) {
		isApiKeySaved.style.color = "green";
		isApiKeySaved.textContent = "🟢 API key saved";
		isApiKeySaved.style.marginLeft = "18px";
	} else {
		isApiKeySaved.style.color = "red";
        isApiKeySaved.textContent = "❗️No API Key Saved";
        isApiKeySaved.style.marginLeft = "13px";
	}
	setTimeout(function () {
		if (settingsMenu.style.display === 'block') {
			settingsMenu.style.display = 'none';
		} else {
			settingsMenu.style.display = 'block';
		}
	},500);
});

/// ------ Send to the bot Trigger ------ ///
buttonSend.addEventListener('click', async function() {
	await whatBotMustDo();
});

/// ------ Save To File Trigger ------ ///
saveToFileButton.addEventListener('click', function() {
	saveUserQuestionsToFile()
});


/// ------ Mic button Redirect WebPage ------ ///

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

// Function to press the button send with the key enter
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const clickEvent = new Event('click');
        buttonSend.dispatchEvent(clickEvent);
    }
});


/// ------ Initialize Language for TTS and Weather ------ ///

function initializeLanguage() {
    console.log('Initializing language...');

    const storedLanguage = getSelectedLanguage();
    console.log('Stored language:', storedLanguage);

    const languageDropdown = document.getElementById('language-select');
    console.log('Language dropdown:', languageDropdown);

    // Définir la valeur du menu déroulant
    languageDropdown.value = storedLanguage;

    console.log('Language set to:', storedLanguage);

}

function getSelectedLanguage() {
    return localStorage.getItem('selectedLanguage'); 
}