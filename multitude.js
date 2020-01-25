function handleButtonClick(event) {
  var button = event.target;
  var audioElement = button.querySelector('audio');
  audioElement.currentTime = 0;
  audioElement.play();
}

function toggleSectionCollapse(event) {
  var heading = event.target;
  heading.classList.toggle('expanded');
  heading.nextSibling.classList.toggle('expanded');
}

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
      currentCategoryElement = document.createElement('div');
      currentCategoryElement.classList.add('buttons');
      var categoryHeading = document.createElement('h2');
      categoryHeading.addEventListener('click', toggleSectionCollapse);
      categoryHeading.appendChild(document.createTextNode(category));
      document.body.appendChild(categoryHeading);
      document.body.appendChild(currentCategoryElement);
      currentCategory = category;
    }

    var button = document.createElement('a');
    var audioElement = new Audio(url);

    button.appendChild(audioElement);
    button.appendChild(document.createTextNode(name));
    currentCategoryElement.appendChild(button);

    button.addEventListener('click', handleButtonClick);
  }
});

noisesXhr.open('GET', 'noises.txt');
noisesXhr.send();
