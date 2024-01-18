import { isVoiceEnabled, 
	GPT_API_KEY, 
	createUserTag, 
	createUserQuestion, 
	createGptTag, 
	appendToConversation, 
	scrollToBottom, 
	clearConversation, 
	modifyLastUserQuestion} from "./utils.js";

import { playBotResponse } from "./speechSynthesis.js";

const URL = 'https://api.openai.com/v1/completions';

/// --------------- ChatGPT Functions --------------- ///

// Function to trigger ChatGPT with user's input and selected language
export async function triggerChatGPT(userInput) {
    clearConversation();
	modifyLastUserQuestion(userInput);
    const userTag = createUserTag();
    const userQuestion = createUserQuestion(userInput);
    const gptTag = createGptTag();

    appendToConversation(userTag);
    appendToConversation(userQuestion);
    appendToConversation(gptTag);

    const gptAnswer = await askQuestion(userInput);
    appendToConversation(gptAnswer);

    if (isVoiceEnabled) {
		const language = document.getElementById('language-select').value; // Get the selected language

		setSelectedLanguage(language);
        playBotResponse(gptAnswer.textContent, language); // Pass the selected language to the playBotResponse function
    }
    scrollToBottom();
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

// Function to extract the selected language from the local storage
export function setSelectedLanguage(language) {
    localStorage.setItem('selectedLanguage', language);
}