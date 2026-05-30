const deleteFolderBtn = document.getElementById('delete-folder-button');

deleteFolderBtn.addEventListener('click', (e) => {
  showDeleteMenu(
    deleteFolderBtn.dataset.folderId,
    deleteFolderBtn.dataset.folderName,
  );
});

const newFolderBtn = document.getElementById('new-folder-button');
newFolderBtn.addEventListener('click', (e) => {
  showNewFolderMenu(newFolderBtn.dataset.parentFolderId);
});

function showDeleteMenu(folderId, name) {
  const dialog = document.createElement('dialog');
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.close();
      dialog.remove();
    }
  });

  const title = document.createElement('span');
  title.textContent = `Are you sure you want to delete the ${name} folder?`;

  const form = document.createElement('form');

  form.action = `/folders/${folderId}/delete`;

  form.method = 'post';

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
  dialog.appendChild(form);
  form.appendChild(buttonContainer);
  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(deleteButton);
  document.body.appendChild(dialog);
  dialog.showModal();
}

function showNewFolderMenu(parentFolderId) {
  const dialog = document.createElement('dialog');
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.close();
      dialog.remove();
    }
  });

  const title = document.createElement('span');
  title.textContent = 'Create Folder';

  const form = document.createElement('form');
  form.action = `/folders/${parentFolderId}/create`;
  form.method = 'post';

  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'name';
  input.required = true;
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
