document.addEventListener('DOMContentLoaded', function() {
  const applyButton = document.getElementById('applyChanges');
  const replaceImagesCheckbox = document.getElementById('replaceImages');
  const imageOptions = document.getElementById('imageOptions');
  const replacementImageUrlInput = document.getElementById('replacementImageUrl');
  const replacementImageFileInput = document.getElementById('replacementImageFile');
  const boldTextCheckbox = document.getElementById('boldText');
  const fontColorInput = document.getElementById('fontColor');

  replaceImagesCheckbox.addEventListener('change', function() {
    imageOptions.style.display = replaceImagesCheckbox.checked ? 'block' : 'none';
  });

  applyButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        colorH1: document.getElementById('colorH1').checked,
        borderImages: document.getElementById('borderImages').checked,
        fontSize: document.getElementById('fontSize').value,
        replaceImages: replaceImagesCheckbox.checked,
        replacementImage: replaceImagesCheckbox.checked
          ? replacementImageUrlInput.value || (replacementImageFileInput.files[0] ? URL.createObjectURL(replacementImageFileInput.files[0]) : null)
          : null,
        boldText: boldTextCheckbox.checked,
        fontColor: fontColorInput.value
      }, function(response) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        }
      });
    });
  });
});
