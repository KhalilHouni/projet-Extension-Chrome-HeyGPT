const buttonSend = document.getElementById('button-send');
const inputQuestion = document.getElementById('user-question');


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
	var userTag = createUserTag();
	var gptAnswer = createGptAnswer();
	var gptTag = createGptTag();
	document.getElementById('conv').appendChild(userTag);
	document.getElementById('conv').appendChild(userQuestion);
	document.getElementById('conv').appendChild(gptTag);
	document.getElementById('conv').appendChild(gptAnswer);
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

function createGptAnswer() {
	var gptAnswer = document.createElement('p');
    gptAnswer.textContent = "prout";
    return gptAnswer;
}

