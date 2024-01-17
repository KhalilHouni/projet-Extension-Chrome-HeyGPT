import { triggerChatGPT } from "./gpt.js";
import { inputQuestion } from "./utils.js";

let synthesis;

// // -------- Speech Synthesis Functions -------- //

export function startSpeechSynthesis() {
    if (!synthesis) {
        synthesis = new webkitSpeechSynthesis();
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

export function stopSpeechSynthesis() {
    if (synthesis) {
        synthesis.stop();
    }
}

// // Function to play bot's response as speech with the selected language
export function playBotResponse(responseText, language) {
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

// // Function to stop the audio
export function stopAudio() {
    window.speechSynthesis.cancel();
}