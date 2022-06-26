let columns = [];
let columnHeights = [];
let columnWidth = 0;
start();

async function start() {
  const container = document.getElementById('container');
  try {
    initContainer(container, '16rem');
    const images = await getImageSrcs();
    await fillColumns(images);
  } catch (err) {
    console.error(err);
    container.innerHTML = `<h3 class="error">Something went wrong whilst loading the images. Please try reloading to fix the issue.</h3>`
  }
}

async function getImageSrcs() {
  const response = await fetch('./photos/');
  const html = await response.text();
  const regex = /"(.+\.jpg)"/g;
  const matches = html.matchAll(regex);
  photos = [];
  for (const match of matches) {
    photos.push(`./photos/${match[1]}`);
  }
  return photos;
}

function initContainer(containerRef, colSize) {
  // If units aren't specified, assume pixels
  if (!isNaN(Number(colSize))) colSize = `${colSize}px`;
  containerRef.style.gridTemplateColumns = colSize;
  const containerWidth = parseInt(window.getComputedStyle(containerRef).getPropertyValue('width'));
  columnWidth = parseInt(window.getComputedStyle(containerRef).getPropertyValue('grid-template-columns'));
  const columnGap = parseInt(window.getComputedStyle(containerRef).getPropertyValue('gap'));
  const columnCount = Math.floor((containerWidth + columnGap) / (columnWidth + columnGap));

  while (containerRef.firstChild) {
    containerRef.removeChild(containerRef.lastChild);
  }
  columns = [];
  columnHeights = [];
  let c = 0;
  while (c < columnCount) {
    const column = document.createElement('div');
    column.classList.add('masonry-column');
    column.style.flexBasis = `${columnWidth}px`;
    columns.push(column);
    columnHeights.push(0);
    containerRef.appendChild(column);
    c++;
  }
}

async function fillColumns(images) {
  let i = 0;
  while (i < images.length) {
    const img = await imagePromise(images[i]);
    img.classList.add('image-display');
    const best = getBestColumn();
    columns[best].appendChild(img);
    // Add current image height and flex-gap size to running total
    columnHeights[best] += (getScaledHeight(img) + parseInt(window.getComputedStyle(columns[best]).getPropertyValue('gap')));
    i++;
  }
}

function getBestColumn() {
  // Get the shortest height out of each column
  const minHeight = [...columnHeights].sort((a,b) => {return a-b;})[0]
  return columnHeights.indexOf(minHeight);
}

function alignColumns() {
  const maxHeight = [...columnHeights].sort((a,b) => {return b-a;})[0];
  let c = 0;
  while (c < columns.length) {
    columns[c].style.height = `${maxHeight}px`;
    columns[c].style.justifyContent = 'space-between';
    c++;
  }
}


function getScaledHeight(image) {
  const scale = columnWidth / image.width;
  return image.height * scale;
}

function imagePromise(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  })
}
