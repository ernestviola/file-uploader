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
    addOptionFileRename(
      btn.dataset.folderId,
      btn.dataset.fileId,
      btn.dataset.currentName,
    ),
  );
  actionMenu.appendChild(
    addOptionFileDownload(btn.dataset.folderId, btn.dataset.fileId),
  );
  actionMenu.appendChild(
    addOptionFileDelete(
      btn.dataset.folderId,
      btn.dataset.fileId,
      btn.dataset.fileName,
    ),
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

function addOptionFileRename(folderId, fileId, value) {
  const optionRename = document.createElement('button');
  optionRename.addEventListener('click', () =>
    showRenameMenu(folderId, fileId, value),
  );
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
function addOptionFileDelete(folderId, fileId, fileName) {
  const optionDelete = document.createElement('button');
  optionDelete.addEventListener('click', () =>
    showDeleteMenu(folderId, fileId, fileName),
  );
  optionDelete.innerText = 'Delete';
  optionDelete.className = 'action-menu-item';
  return optionDelete;
}

function showRenameMenu(folderId, fileId, value) {
  const dialog = document.createElement('dialog');
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.close();
      dialog.remove();
    }
  });

  const title = document.createElement('span');
  title.textContent = fileId ? 'Rename File' : 'Rename Folder';

  const form = document.createElement('form');
  form.action = `/folders/${folderId}/files/${fileId}/update`;
  form.method = 'post';

  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'name';
  input.required = true;
  input.value = value;
  input.autocomplete = 'off';

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'dialog-buttons';

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.type = 'button';
  cancelButton.addEventListener('click', () => {
    dialog.close();
    dialog.remove();
  });

  const saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.type = 'submit';

  dialog.appendChild(title);
  dialog.appendChild(form);
  form.appendChild(input);
  form.appendChild(buttonContainer);
  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(saveButton);
  document.body.appendChild(dialog);
  dialog.showModal();
}

function showDeleteMenu(folderId, fileId, name) {
  const dialog = document.createElement('dialog');
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.close();
      dialog.remove();
    }
  });

  const title = document.createElement('span');
  title.textContent = 'Are you sure you want to delete?';

  const form = document.createElement('form');
  if (fileId) {
    form.action = `/folders/${folderId}/files/${fileId}/delete`;
  }

  form.method = 'post';

  const fileName = document.createElement('p');
  fileName.textContent = name;

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'dialog-buttons';

  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Cancel';
  cancelButton.type = 'button';
  cancelButton.addEventListener('click', () => {
    dialog.close();
    dialog.remove();
  });

  const deleteButton = document.createElement('button');
  deleteButton.className = 'warning';
  deleteButton.textContent = 'Delete';
  deleteButton.type = 'submit';

  dialog.appendChild(title);
  dialog.appendChild(fileName);
  dialog.appendChild(form);
  form.appendChild(buttonContainer);
  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(deleteButton);
  document.body.appendChild(dialog);
  dialog.showModal();
}
