const folder = document.getElementById('folder');
const front = document.getElementById('front');
folder.addEventListener('click', (e) => {
  if (front.classList.contains('closed')) {
    front.classList.add('open');
    front.classList.remove('closed');
  } else {
    front.classList.add('closed');
    front.classList.remove('open');
  }
});
