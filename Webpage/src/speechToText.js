import { micCheckbox,
	micSwitch, 
	micOn, 
	inputQuestion,
	recognition,
	defineRecognition } from './utils.js';

let microphone;
let audioContext;

// /// --------------- Record mic functions --------------- ///


export async function toggleRecognition() {
	if (micCheckbox.checked) {
		const actualRecognition = await setupMicrophone();
		console.log('Mic is on');
		actualRecognition.start();
		toggleMicOn();
	} else {
		console.log('Mic is off');
		stopMicrophone();
		toggleMicOff();
	}

	recognition.onresult = (event) => {
		const result = event.results[event.resultIndex];
		const transcription = result[0].transcript;
		console.log(transcription);
		inputQuestion.value = transcription;
	};
	recognition.onerror = (event) => {
		console.error(event.error);
	};
}

// // Request permission to use the microphone and set up it
async function setupMicrophone() {
	return await navigator.mediaDevices.getUserMedia({ audio: true })
	  .then((stream) => {

		audioContext = new (window.AudioContext || window.webkitAudioContext)();
		microphone = audioContext.createMediaStreamSource(stream);
		defineRecognition();

        if (!recognition) {
            console.error('Speech recognition is not supported in your browser.');
            return null;
        }

		return recognition
	})
}

function toggleMicOn() {
	micSwitch.style.backgroundColor = "red";
	micOn.style.transform = "scale(1.3)";
}

function toggleMicOff() {
	setTimeout(function() {
		micSwitch.style.backgroundColor = "black";
		micOn.style.transform ='scale(1)';
	}, 300);
}


function stopMicrophone() {
    if (recognition) {
        recognition.stop();
    }
    if (microphone && microphone.mediaStream) {
        microphone.mediaStream.getTracks()[0].stop();
    }
    if (audioContext) {
        audioContext.close();
    }
}