import { modifyLastUserQuestion, lastUserQuestion } from "./utils.js";

// /// --------------- Save To File Functions --------------- ///

// // Function to log the user question in the console and save it to a .txt file
export function saveUserQuestionsToFile() {

    if (lastUserQuestion) {
        // Create a Blob containing the user question as a .txt file
        const blob = new Blob([lastUserQuestion], { type: 'text/plain' });

        // Use FileReader to read the Blob as a data URL
        const reader = new FileReader();
        reader.onload = function(event) {
            // Create a download link for the .txt file
            const downloadLink = document.createElement('a');
            downloadLink.download = 'user_question.txt';
            downloadLink.href = event.target.result;
            downloadLink.click();
        };
        reader.readAsDataURL(blob);
		modifyLastUserQuestion("");
    } else {
        console.error('No user question found to save.');
    }
}