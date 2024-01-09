const buttonSend = document.getElementById('button-send');
const inputQuestion = document.getElementById('user-question');
const convArea = document.getElementById('conv');

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
buttonSend.addEventListener('click', function() {
    var userQuestion = createUserQuestion();
	if (!userQuestion) return;
	var userTag = createUserTag();
	var gptTag = createGptTag();
	var gptAnswer = askQuestion(userQuestion);
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

async function askQuestion(userQuestion) {

    if (!userQuestion) return;

    const response = await fetch('/ask', {
	method: 'POST',
    headers: {
    	'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question: userQuestion }),
    });

    const result = await response.json();
    const botReply = result.botReply;
	return botReply;
}