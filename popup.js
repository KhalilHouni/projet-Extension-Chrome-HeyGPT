
const buttonSend = document.getElementById('button-send');
const inputQuestion = document.getElementById('user-question');
const convArea = document.getElementById('conv');
const deleteButton = document.getElementById('delete-button');
const API_KEY = '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';
const URL = 'https://api.openai.com/v1/completions';
let synthesis;
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
        startSpeechSynthesis();
    } else {
        stopSpeechSynthesis();
    }
});

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

// Stop speech synthesis
function stopSpeechSynthesis() {
    synthesis.stop();
}

// Event listener for send button
buttonSend.addEventListener('click', function() {
    const userQuestion = inputQuestion.value;
    if (userQuestion) {
        if (shouldPerformGoogleSearch(userQuestion)) {
            if (shouldPerformGoogleImagesSearch(userQuestion)) {
                const lookingMessage = createLookingMessage();
                appendToConversation(lookingMessage);
                stopSpeechSynthesis();
                performGoogleImagesSearch(userQuestion);
            } else {
                const lookingMessage = createLookingMessage();
                appendToConversation(lookingMessage);
                stopSpeechSynthesis();
                performGoogleSearch(userQuestion);
            }
        } else {
            triggerChatGPT(userQuestion);
        }
    }
});

// Function to check if the user wants to perform a Google search
function shouldPerformGoogleSearch(userQuestion) {
    return userQuestion.toLowerCase().includes('search on google') && !shouldPerformGoogleImagesSearch(userQuestion);
}

// Function to check if the user wants to perform a Google Images search
function shouldPerformGoogleImagesSearch(userQuestion) {
    return userQuestion.toLowerCase().includes('search on google pictures of');
}

// Function to perform the Google Images search with the actual query
function performGoogleImagesSearch(query) {
    const searchKeyword = 'search on google pictures of';
    const searchQuery = query.substring(searchKeyword.length).trim(); // Extract the actual query part after "search on google pictures of"
    stopSpeechSynthesis(); // Stop the bot response
    chrome.runtime.sendMessage({ action: 'performGoogleImagesSearch', query: searchQuery });
}


// Function to create "looking on the browser..." message
function createLookingMessage() {
    const lookingMessage = document.createElement('p');
    lookingMessage.textContent = "Looking on the browser...";
    return lookingMessage;
}

// Function to perform the Google search with the actual query
function performGoogleSearch(query) {
    chrome.runtime.sendMessage({ action: 'performGoogleSearch', query: query });
}



// Function to stop speech synthesis
function stopSpeechSynthesis() {
    if (synthesis) {
        synthesis.stop();
    }
}



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

////////////////////////////////////
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

// Function to delete conversation when delete button is clicked
deleteButton.addEventListener('click', function() {
	stopAudio();
    clearConversation();
});

// Function to trigger Google search query using fully-formed http URL
function googleForAnswers(url) {
    const functionCall = {
        name: "google_for_answers",
        arguments: {
            url: url
        }
    };

    const message = {
        role: "assistant",
        content: null,
        function_call: functionCall
    };

    // Send the message to the assistant for Google search
    // (you can use your specific way of sending message to the assistant here)
}