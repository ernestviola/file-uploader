const actionBtns = [...document.getElementsByClassName('btn-actions')];

actionBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => handleActionButtonClick(e, btn));
});

window.addEventListener('pageshow', () => {
  removeActionMenu();
});

document.addEventListener('click', removeActionMenu);

function handleActionButtonClick(e, btn) {
  e.stopPropagation();
  removeActionMenu();
  showActionMenu(e.clientX, e.clientY, btn);
}
function showActionMenu(x, y, btn) {
  const actionMenu = document.createElement('div');
  actionMenu.className = 'action-menu';
  actionMenu.style.left = '-9999px';
  actionMenu.style.top = '-9999px';
  actionMenu.appendChild(
    addOptionFileRename(btn.dataset.folderId, btn.dataset.fileId),
  );
  actionMenu.appendChild(
    addOptionFileDownload(btn.dataset.folderId, btn.dataset.fileId),
  );
  actionMenu.appendChild(
    addOptionFileDelete(btn.dataset.folderId, btn.dataset.fileId),
  );
  document.body.appendChild(actionMenu);

  const rect = actionMenu.getBoundingClientRect();
  if (x + rect.width > window.innerWidth) {
    // flip
    actionMenu.style.left = `${x - rect.width}px`;
    actionMenu.style.top = `${y}px`;
  } else {
    actionMenu.style.left = `${x}px`;
    actionMenu.style.top = `${y}px`;
  }
}
function removeActionMenu() {
  const existingMenu = document.querySelector('.action-menu');
  if (existingMenu) existingMenu.remove();
}

function addOptionFileRename(folderId, fileId) {
  const optionRename = document.createElement('button');
  optionRename.addEventListener('click', showRenameMenu(folderId, fileId));
  optionRename.innerText = 'Rename';
  optionRename.className = 'action-menu-item';
  return optionRename;
}
function addOptionFileDownload(folderId, fileId) {
  const optionDownload = document.createElement('a');
  optionDownload.innerText = 'Download';
  optionDownload.className = 'action-menu-item';
  optionDownload.href = `/folders/${folderId}/files/${fileId}/download`;
  return optionDownload;
}
function addOptionFileDelete(folderId, fileId) {
  const optionDelete = document.createElement('button');
  optionDelete.addEventListener('click', showDeleteMenu(folderId, fileId));
  optionDelete.innerText = 'Delete';
  optionDelete.className = 'action-menu-item';
  return optionDelete;
}

function addOptionFolderRename(folderId) {
  const optionRename = document.createElement('button');
  optionRename.addEventListener('click', showRenameMenu());
  optionRename.innerText = 'Rename';
  optionRename.className = 'action-menu-item';
  return optionRename;
}
function addOptionFolderDelete(folderId) {
  const optionDelete = document.createElement('button');
  optionDelete.addEventListener('click', showRenameMenu(folderId));
  optionDelete.innerText = 'Delete';
  optionDelete.className = 'action-menu-item';
  return optionDelete;
}

function showRenameMenu(folderId, fileId) {}
function showDeleteMenu(folderId, fileId) {}
