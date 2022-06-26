async function load() {
  const response = await fetch('../images.json');
  const images = await response.json();
  let i = 0;
  while (i < images.length) {
    images[i] = `.${images[i]}`;
    i++;
  }
  const displays = document.querySelectorAll('image-display');
  for (const display of displays) {
    display.fillColumns(images);
  }
}

load();

//window.addEventListener('resize', load);
