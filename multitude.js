function toggleExpansion(heading) {
  heading.classList.toggle('expanded');
  heading.nextSibling.classList.toggle('expanded');
}

function handleButtonClick(event) {
  event.preventDefault();
  var button = event.currentTarget;
  var audioElement = button.querySelector('audio');
  audioElement.currentTime = 0;
  audioElement.play();
}

function toggleSectionCollapse(event) {
  event.preventDefault();
  toggleExpansion(event.currentTarget.parentNode);
}

function everythingShouldBeExpanded(expanded) {
  var headings = document.querySelectorAll('h2');
  for (var i = 0; i < headings.length; i++) {
    if (headings[i].classList.contains('expanded') ^ expanded) {
      toggleExpansion(headings[i]);
    }
  }
}

function updateProgress(event) {
  var audio = event.currentTarget;
  var progressElement = audio.parentNode.querySelector('.progress');
  var progress;

  if (audio.ended || audio.paused) {
    progress = 0;
  } else {
    progress = audio.currentTime / audio.duration;
  }

  progressElement.style.width = (progress * 100).toString(10) + '%';
}

document.getElementById('expand-all').addEventListener('click', function(event) {
  event.preventDefault();
  everythingShouldBeExpanded(true);
});

document.getElementById('collapse-all').addEventListener('click', function(event) {
  event.preventDefault();
  everythingShouldBeExpanded(false);
});

var noisesXhr = new XMLHttpRequest();

noisesXhr.addEventListener('load', function() {
  var filenames = this.responseText.split('\n');
  var currentCategory;
  var currentCategoryElement;

  for(var i = 0; i < filenames.length; i++) {
    if (!filenames[i]) continue;
    url = 'noises/' + encodeURIComponent(filenames[i]);
    var category = filenames[i].split(':')[0];
    var name = filenames[i].split(':')[1].split('.')[0];

    if (category !== currentCategory) {
      currentCategoryElement = document.createElement('div');
      currentCategoryElement.classList.add('buttons');
      var categoryHeading = document.createElement('h2');
      var categoryHeadingLink = document.createElement('a');
      categoryHeadingLink.href = '#';
      categoryHeadingLink.addEventListener('click', toggleSectionCollapse);
      categoryHeadingLink.appendChild(document.createTextNode(category));
      categoryHeading.appendChild(categoryHeadingLink);
      document.body.appendChild(categoryHeading);
      document.body.appendChild(currentCategoryElement);
      currentCategory = category;
    }

    var button = document.createElement('a');
    button.href = url;
    var audioElement = new Audio(url);
    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('durationchange', updateProgress);
    audioElement.addEventListener('playing', updateProgress);
    audioElement.addEventListener('ended', updateProgress);

    button.appendChild(audioElement);
    button.appendChild(document.createTextNode(name));

    var progress = document.createElement('div');
    progress.classList.add('progress');
    button.appendChild(progress);

    button.addEventListener('click', handleButtonClick);

    currentCategoryElement.appendChild(button);
  }

  everythingShouldBeExpanded(true);
});

noisesXhr.open('GET', 'noises.txt');
noisesXhr.send();
