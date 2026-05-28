const folder = document.getElementById('folder');
const front = document.getElementById('front');
const filesContainer = document.body;

const folderPosition = getOffset(folder);
console.log('folder', folderPosition);
let fileObjects = [];
fileInitialize();
fileRandomize();

folder.addEventListener('click', (e) => {
  if (front.classList.contains('closed')) {
    front.classList.add('open');
    front.classList.remove('closed');
    fileObjects.forEach((img) => {
      img.el.classList.add('file-img-active');
      img.el.style.left = `${img.endCoord.x}px`;
      img.el.style.top = `${img.endCoord.y}px`;
      img.el.style.height = `${img.endHeight}px`;
      img.el.style.transform = `rotate(${img.rotation}deg)`;
    });
  } else {
    front.classList.add('closed');
    front.classList.remove('open');
    fileObjects.forEach((img) => {
      img.el.style.left = `${img.startCoord.x}px`;
      img.el.style.top = `${img.startCoord.y}px`;
      img.el.style.height = `${img.startHeight}px`;
    });
    fileRandomize();
  }
});

function fileInitialize() {
  fileObjects = files.map((file) => {
    const el = document.createElement('img');
    el.className = 'file-img';
    el.src = `/folder-assets/${file}`;
    filesContainer.appendChild(el);
    const startHeight = 10;
    const startCoord = {
      x: front.offsetWidth / 2 + folderPosition.x,
      y: folderPosition.y - Math.floor(Math.random() * 5) + 20,
    };

    el.style.left = `${startCoord.x}px`;
    el.style.top = `${startCoord.y}px`;
    el.style.height = `${startHeight}px`;
    return {
      el,
      startHeight,
      startCoord,
    };
  });
}

function fileRandomize() {
  shuffle(fileObjects);
  fileObjects.forEach((file, i) => {
    file.endHeight = Math.floor(25 + Math.random() * 100);
    file.endCoord = customXY(i, fileObjects.length);
    file.rotation = Math.random() * 30 - 15;
  });
}

function getOffset(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY,
  };
}

function randomXY() {
  return {
    x: window.innerWidth - Math.random() * window.innerWidth,
    y: window.innerHeight - Math.random() * window.innerHeight,
  };
}

function sunflowerXY(i, center) {
  const c =
    (Math.min(window.innerWidth, window.innerHeight) /
      Math.sqrt(fileObjects.length)) *
    0.5;
  const radius = c * Math.sqrt(i);
  const angleRad = (i * 137.5 * Math.PI) / 180;
  const xScale = 1;
  const yScale = 2;
  const x = Math.floor(center.x + radius * Math.cos(angleRad) * xScale);
  const y = Math.floor(center.y + radius * Math.sin(angleRad) * yScale);
  const xClamped = Math.max(0, Math.min(window.innerWidth, x));
  const yClamped = Math.max(-50, Math.min(folderPosition.y, y));
  const coords = {
    x: xClamped,
    y: yClamped,
  };
  console.log(coords);
  return coords;
}

function customXY(i, n) {
  const x = (window.innerWidth / (n + 1)) * (i + 1);
  const y = Math.random() * (folderPosition.y - 150);
  return { x, y };
}

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}
