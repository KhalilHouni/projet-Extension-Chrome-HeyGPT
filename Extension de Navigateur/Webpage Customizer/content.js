// content.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.colorH1) {
    const h1Elements = document.querySelectorAll('h1');
    h1Elements.forEach(h1 => {
      h1.style.color = 'green';
    });
  }

  if (request.borderImages) {
    const imgElements = document.querySelectorAll('img');
    imgElements.forEach(img => {
      img.style.border = '2px solid red';
    });
  }

  if (request.fontSize) {
    document.body.style.fontSize = request.fontSize + 'px';
  }

  if (request.replaceImages && request.replacementImage) {
    const imgElements = document.querySelectorAll('img');
    imgElements.forEach(img => {
      if (typeof request.replacementImage === 'string') {
        img.src = request.replacementImage;
      } else if (request.replacementImage instanceof File) {
        const reader = new FileReader();
        reader.onload = function(e) {
          img.src = e.target.result;
        };
        reader.readAsDataURL(request.replacementImage);
      } else {
        // Si l'URL ou le fichier n'est pas valide, supprime simplement l'image
        img.style.display = 'none';
      }
    });
  }

  if (request.boldText) {
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, li, td, th');
    textElements.forEach(textElement => {
      textElement.style.fontWeight = request.boldText ? 'bold' : 'normal';
    });
  }

  if (request.fontColor) {
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, li, td, th');
    textElements.forEach(textElement => {
      textElement.style.color = request.fontColor;
    });
  }
});
