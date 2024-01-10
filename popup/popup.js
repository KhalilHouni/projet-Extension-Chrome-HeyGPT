const buttonSend = document.getElementById('button-send');
const inputQuestion = document.getElementById('user-question');
const convArea = document.getElementById('conv');
const deleteButton = document.getElementById('delete-button');
const API_KEY = 'API_KEY';
const URL = 'https://api.openai.com/v1/completions';


// When the page is loaded print welcome message
document.addEventListener('DOMContentLoaded', function() {
    var welcome = document.createElement('p');
    welcome.textContent = "Bienvenue, je suis Hey GPT. Posez moi n'importe quelle question, oralement avec le boutton microphone en dessous, ou textuellement avec le champ pour insérer votre message en dessous aussi. Je ferais la meilleure réponse possible. J'ai été fait avec ❤️ par Khalil, Maud et Rémy.";
	var gptTag = createGptTag();
	convArea.appendChild(gptTag);
	convArea.appendChild(welcome);
});


// Squeeze the mic button
document.getElementById('checkbox').addEventListener('change', function() {
	if (this.checked) {
	  document.querySelector('.switch').style.transform = 'scale(1.2)';
	  setTimeout(function() {
		document.querySelector('.switch').style.transform = 'scale(1)';
	  }, 500);
	  this.checked = false;
	} else {
	  document.querySelector('.switch').style.transform = 'scale(1)';
	}
});


// Get the user question from the input when button send is clicked
// Then after clicking the button show the user question on the mid div
buttonSend.addEventListener('click', async function() {
	if (!inputQuestion.value) 
		return ;
	convArea.innerHTML = "";
	var userTag = createUserTag();
    var userQuestion = createUserQuestion();
	var gptTag = createGptTag();
	convArea.appendChild(userTag);
	convArea.appendChild(userQuestion);
	convArea.appendChild(gptTag);
	var gptAnswer = await askQuestion(userQuestion.textContent);
	console.log(gptAnswer);
	convArea.appendChild(gptAnswer);
	scrollToBottom();
});

function createUserTag() {
	var userTag = document.createElement('h4');
	userTag.textContent = 'User';
	return userTag;
}

function createUserQuestion() {
	var userQuestion = document.createElement('p');
	userQuestion.textContent = inputQuestion.value;
	inputQuestion.value = "";
	return userQuestion;
}

function createGptTag() {
	var gptTag = document.createElement('h4');
    gptTag.textContent = 'Hey GPT';
    return gptTag;
}

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
		temperature: 0.7,
		max_tokens: 150,
    });
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: headers,
            body: body,
        });

        const answer = await createAnswerGpt(response);
		return answer; // La réponse de ChatGPT est stockée dans cette variable
    } catch (error) {
        console.error('Erreur lors de l\'appel API à ChatGPT:', error);
        return null;
    }
}

async function createAnswerGpt(response) {
	const data = await response.json();
	const answer = document.createElement('p');
	answer.textContent = data.choices[0].text;
	return answer;
}

// Function to delete conversation when delete button is clicked
deleteButton.addEventListener('click', function() {
    convArea.innerHTML = "";
});