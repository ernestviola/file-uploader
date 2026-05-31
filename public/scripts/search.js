window.addEventListener('click', () => removeSearchResults());

const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', (e) => e.preventDefault());

const search = document.getElementById('search');
search.addEventListener('click', (e) => {
  e.stopPropagation();
});
let timeout;
search.addEventListener('input', () => {
  if (search.value) {
    clearTimeout(timeout);

    timeout = setTimeout(async () => {
      const objects = await fetchObjects();
      if (search.value) {
        loadSearchResults(objects);
      }
    }, 300);
  } else {
    removeSearchResults();
  }
});

async function fetchObjects() {
  const response = await fetch(`/folders/search?searchTerm=${search.value}`);
  const data = await response.json();
  return data.objects;
}

function loadSearchResults(objects) {
  removeSearchResults();
  const rect = search.getBoundingClientRect();
  const searchResults = document.createElement('div');
  searchResults.id = 'search-results';
  searchResults.style.left = `${rect.x}px`;
  searchResults.style.top = `${rect.y + rect.height + 10}px`;
  console.log(rect.x, rect.y);
  objects.forEach((object) => {
    const link = document.createElement('a');
    if (object.type === 'folder') {
      // link to folder
      link.href = `/folders/${object.folderId}`;
      const folderImg = document.createElement('img');
      folderImg.src = '/icons/blue-folder-closed.svg';
      link.appendChild(folderImg);
    } else {
      // download link for file
      link.href = `/folders/${object.folderId}/files/${object.fileId}/download`;
      const downloadImg = document.createElement('img');
      downloadImg.src = '/icons/download.svg';
      link.appendChild(downloadImg);
    }
    const textNode = document.createTextNode(object.name);
    link.appendChild(textNode);
    searchResults.appendChild(link);
  });
  document.body.appendChild(searchResults);
}

function removeSearchResults() {
  const searchResults = document.getElementById('search-results');

  if (searchResults) searchResults.remove();
}
