init();

async function init() {
  const photos = await getImagesFrom('./photos/');
  await displayPhotos(photos);
  // if (navigator.userAgent.search('Firefox') === -1) {
  //   resizeAllItems();
  // } else {
  //   resizeAllItems(true);
  // }
}

async function getImagesFrom(relativeDir) {
  const response = await fetch(relativeDir);
  const html = await response.text();
  const regex = /"(.+\.jpg)"/g;
  const matches = html.matchAll(regex);
  const photos = [];
  for (const match of matches) {
    photos.push(match[1]);
  }
  return photos;//.sort(() => Math.random() - 0.5);
}

function getAspectRatio(width, height) {
  if (width > height) {
   return [2, 1];
  } else if (width < height) {
   return [1, 2];
  } else {
   return [1, 1];
  }
  if (width > height) {
    return [Math.round(width/height), 1];
  } else if (height > width) {
    return [1,Math.round(height/width)];
  } else {
    return [1, 1];
  }
}

function displayPhotos(photos) {
  for (const photo of photos) {
    const container = document.createElement('div');
    container.classList.add('img-container');
    const img = document.createElement('img');
    img.onload = () => {
      if (navigator.userAgent.search('Firefox') === -1) {
        resizeImgCol(container)
        resizeImgRow(container)
      }
    }
    img.src = `./photos/${photo}`;
    // img.loading = 'lazy';


    // const [w, h] = getAspectRatio(img.width, img.height);

    // container.style.gridColumnEnd = `span ${w}`;
    // container.style.gridRowEnd = `span ${h}`;

    img.addEventListener('click', () => {
      window.open(img.src);
    })

    container.appendChild(img);
    document.body.appendChild(container);
  }
}

function resizeImgRow(element) {
  const container = document.body;
  const img = element.querySelector('img');
  const rowHeight = parseInt(window.getComputedStyle(container).getPropertyValue('grid-auto-rows'));
  const rowGap = parseInt(window.getComputedStyle(container).getPropertyValue('grid-row-gap'));
  const rowSpan = Math.ceil((img.getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
  element.style.gridRowEnd = 'span ' + rowSpan;
}

function resizeImgCol(element) {
  const container = document.body;
  const img = element.querySelector('img');
  const colWidth = parseInt(window.getComputedStyle(container).getPropertyValue('grid-template-columns'));
  const colGap = parseInt(window.getComputedStyle(container).getPropertyValue('grid-column-gap'));
  const colSpan = Math.ceil((img.getBoundingClientRect().width + colGap) / (colWidth + colGap));
  element.style.gridColumnEnd = 'span ' + colSpan;
}

function resizeAllItems(isFirefox) {
  const elements = document.querySelectorAll('.img-container');
  let i = 0;
  while (i < elements.length) {
    resizeImgCol(elements[i]);
    if (!isFirefox) {
      resizeImgRow(elements[i]);
    }
    i++;
  }
}
