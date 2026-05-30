const input = document.getElementById('current-folder');

input.addEventListener('click', (e) => {
  e.stopPropagation();
});

input.addEventListener('focus', () => {
  const range = document.createRange();
  range.selectNodeContents(input);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    saveFolder(input.innerText, input.dataset.folderId);
    input.blur();
  }
});

input.addEventListener('blur', () => {
  saveFolder(input.innerText, input.dataset.folderId);
});

async function saveFolder(name, folderId) {
  console.log(input.dataset.folderId);
  const reqURL = `/folders/${folderId}/update`;
  console.log(reqURL);
  await fetch(reqURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
    credentials: 'same-origin',
  });
}
