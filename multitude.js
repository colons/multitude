function handleButtonClick(event) {
  var button = event.target;
  var audioElement = button.querySelector('audio');
  audioElement.fastSeek(0);
  audioElement.play();
}

var ac = (window.AudioContext || window.webkitAudioContext);
var ctx = new ac();

var noisesXhr = new XMLHttpRequest();

noisesXhr.addEventListener('load', function() {
  var filenames = this.responseText.split('\n');
  var currentCategory;
  var currentCategoryElement;

  for(var i = 0; i < filenames.length; i++) {
    if (!filenames[i]) continue;
    url = 'noises/' + filenames[i];
    var category = filenames[i].split(':')[0];
    var name = filenames[i].split(':')[1].split('.')[0];

    if (category !== currentCategory) {
      currentCategoryElement = document.createElement('section');
      var categoryHeading = document.createElement('h2');
      categoryHeading.appendChild(document.createTextNode(category));
      currentCategoryElement.appendChild(categoryHeading);
      document.body.appendChild(currentCategoryElement);
      currentCategory = category;
    }

    var button = document.createElement('button');
    var audioElement = document.createElement('audio');
    audioElement.src = url;

    button.appendChild(audioElement);
    button.appendChild(document.createTextNode(name));
    currentCategoryElement.appendChild(button);

    var track = ctx.createMediaElementSource(audioElement);
    track.connect(ctx.destination);

    button.addEventListener('click', handleButtonClick);
  }
});

noisesXhr.open('GET', 'noises.txt');
noisesXhr.send();
