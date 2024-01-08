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