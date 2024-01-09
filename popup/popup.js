const buttonSend = document.getElementById('button-send');
const inputQuestion = document.getElementById('user-question');
const convArea = document.getElementById('conv');
const apiKey = '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';
const url = 'https://api.openai.com/v1/completions';

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
    var userQuestion = createUserQuestion();
	var userTag = createUserTag();
	var gptTag = createGptTag();
	var gptAnswer = await askQuestion(userQuestion.textContent);
	console.log(gptAnswer);
	convArea.appendChild(userTag);
	convArea.appendChild(userQuestion);
	convArea.appendChild(gptTag);
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
    gptTag.textContent = 'GPT';
    return gptTag;
}

function scrollToBottom() {
	convArea.scrollTop = convArea.scrollHeight;
}




// Fonction pour appeler l'API à ChatGPT

async function askQuestion(userQuestion) {
	console.log(userQuestion);
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
    };

    const body = JSON.stringify({
		model: 'gpt-3.5-turbo-instruct',
		prompt: `${userQuestion}`,
		temperature: 0.7,
		max_tokens: 150,
    });
    try {
        const response = await fetch(url, {
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
