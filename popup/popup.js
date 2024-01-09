var userQuestion = "";
const gptAnswer = "prout";
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
	console.log("prout");
    userQuestion = inputQuestion.value;
	inputQuestion.value = "";
	document.getElementById('mid').innerHTML = userQuestion;
});

