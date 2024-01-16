import { micSwitch, micOn, recognition } from './utils.js';

var microphone;
var audioContext;

/// --------------- Record mic functions --------------- ///

// Request permission to use the microphone and set up it
export async function setupMicrophone() {
	return await navigator.mediaDevices.getUserMedia({ audio: true })
	  .then((stream) => {

		audioContext = new (window.AudioContext || window.webkitAudioContext)();
		microphone = audioContext.createMediaStreamSource(stream);
		recognition = new webkitSpeechRecognition();

        if (!recognition) {
            console.error('Speech recognition is not supported in your browser.');
            return null;
        }

		recognition.lang = 'fr-FR';
		recognition.interimResults = true;
		recognition.continuous = false;
		return recognition
	})
}

export function toggleMicOn() {
	micSwitch.style.backgroundColor = "red";
	micOn.style.transform = "scale(1.3)";
}

export function toggleMicOff() {
	setTimeout(function() {
		micSwitch.style.backgroundColor = "black";
		micOn.style.transform ='scale(1)';
	}, 300);
}


export function stopMicrophone() {
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