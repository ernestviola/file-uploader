const fileSizes = [...document.getElementsByClassName('fileSize')];

fileSizes.forEach((file) => {
  file.textContent = formatFileSize(parseInt(file.textContent));
});

const usageFrac = [...document.getElementsByClassName('storage-status-frac')];

usageFrac.forEach((frac) => {
  frac.textContent = formatFileSize(frac.dataset.value);
});

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} b`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} kb`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} mb`;
  return `${(bytes / 1024 ** 3).toFixed(1)} gb`;
}
