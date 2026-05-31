document.addEventListener('dragover', (e) => e.preventDefault());

const deleteFolderBtn = document.getElementById('delete-folder-button');

deleteFolderBtn.addEventListener('click', (e) => {
  showDeleteFolderMenu(
    deleteFolderBtn.dataset.folderId,
    deleteFolderBtn.dataset.folderName,
  );
});

const newFolderBtn = document.getElementById('new-folder-button');
newFolderBtn.addEventListener('click', (e) => {
  showNewFolderMenu(newFolderBtn.dataset.parentFolderId);
});

const newFileBtn = document.getElementById('new-files-button');
newFileBtn.addEventListener('click', () => {
  showNewFilesMenu(newFileBtn.dataset.parentFolderId);
});

function showDeleteFolderMenu(folderId, name) {
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

/**
  <form
    action="/folders/<%= locals.folder.id %>/files/new"
    method="post"
    enctype="multipart/form-data"
  >
    <input type="file" aria-label="New Files" name="files" multiple />
    <button type="submit">Save</button>
  </form>
 */
function showNewFilesMenu(parentFolderId) {
  const dialog = document.createElement('dialog');
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      dialog.close();
      dialog.remove();
    }
  });

  const title = document.createElement('span');
  title.textContent = 'Add files';

  const form = document.createElement('form');
  form.action = `/folders/${parentFolderId}/files/new`;
  form.method = 'post';
  form.enctype = 'multipart/form-data';

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
  form.appendChild(createFilePicker());
  form.appendChild(buttonContainer);
  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(saveButton);
  document.body.appendChild(dialog);
  dialog.showModal();
}

function createFilePicker() {
  let files = {};

  const filePickerContainer = document.createElement('div');
  filePickerContainer.className = 'file-picker-container';
  const input = document.createElement('input');
  input.type = 'file';
  input.name = 'files';
  input.required = true;
  input.multiple = true;
  input.className = 'files-input';
  input.hidden = true;

  const msgContainer = document.createElement('div');

  filePickerContainer.appendChild(msgContainer);
  filePickerContainer.append(input);

  filePickerContainer.addEventListener('drop', (e) => {
    e.preventDefault();

    for (const file of e.dataTransfer.files) {
      files[file.name + file.lastModified] = file;
    }

    updateFiles();
  });

  filePickerContainer.addEventListener('click', (e) => {
    if (e.target === input) return;
    input.click();
  });

  input.addEventListener('change', () => {
    for (const file of input.files) {
      files[file.name + file.lastModified] = file;
    }
    updateFiles();
  });

  updateFiles();
  return filePickerContainer;

  function updateFiles() {
    const dt = new DataTransfer();
    Object.values(files).forEach((file) => {
      dt.items.add(file);
    });
    input.files = dt.files;

    if (Object.keys(files).length > 0) {
      msgContainer.replaceChildren();
      const list = document.createElement('ol');
      msgContainer.appendChild(list);

      Object.values(files).forEach((file, index) => {
        const newFile = document.createElement('li');
        newFile.textContent = `${file.name}`;
        list.appendChild(newFile);
      });
    } else {
      const pickerMsg = document.createElement('span');
      const uploadImg = document.createElement('img');
      uploadImg.src = '/icons/upload.svg';
      pickerMsg.textContent = 'Drag and drop or click to add files.';
      msgContainer.appendChild(uploadImg);
      msgContainer.appendChild(pickerMsg);
    }
  }
}
