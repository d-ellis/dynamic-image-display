const displayTemplate = document.createElement('template');
displayTemplate.innerHTML = `
<div id="container"></div>
<style>
#container {
  padding: 0.5vw;
  margin: 0;
  width: inherit;
  height: inherit;
  overflow-y: auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 0.6rem;
}
.masonry-column {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.5rem;
}
.image-display {
  border-radius: 1rem;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.image-display:hover {
  cursor: pointer;
  filter: brightness(0.8);
}
.error {
  margin: 0;
  padding: 0.5rem;
  color: #d64933;
  background-color: #000000;
}
</style>
`;

class ImageDisplay extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(displayTemplate.content.cloneNode(true));
    this.container = this.shadowRoot.querySelector('#container');

    this.load();
  }

  load() {
    this.width = parseInt(window.getComputedStyle(this).getPropertyValue('width'));
    this.container.style.gridTemplateColumns = this.getAttribute('column-width') || '16rem';
    this.columnWidth = parseInt(window.getComputedStyle(this.container).getPropertyValue('grid-template-columns'));
    this.container.style.gap = this.getAttribute('gap') || '0.5rem';
    this.gap = parseInt(window.getComputedStyle(this.container).getPropertyValue('gap'));
    const columnCount = Math.floor((this.width + this.gap) / (this.columnWidth + this.gap));

    // Reset container to blank
    while (this.container.firstChild) {
      this.container.removeChild(this.container.lastChild);
    }

    this.columns = [];
    this.columnHeights = [];

    let c = 0;
    while (c < columnCount) {
      const column = document.createElement('div');
      column.classList.add('masonry-column');
      column.style.flexBasis = `${this.columnWidth}px`;
      this.columns.push(column);
      this.columnHeights.push(0);
      this.container.appendChild(column);
      c++;
    }
  }

  async fillColumns(images) {
    let i = 0;
    while (i < images.length) {
      const img = await this.imagePromise(images[i]);
      img.addEventListener('click', () => {
        window.open(img.src);
      });
      img.classList.add('image-display');
      const best = this.getBestColumn();
      this.columns[best].appendChild(img);
      // Add current image height and flex-gap size to running total
      this.columnHeights[best] += (this.getScaledHeight(img) + parseInt(window.getComputedStyle(this.columns[best]).getPropertyValue('gap')));
      i++;
    }
  }

  getBestColumn() {
    // Get the shortest height out of each column
    const minHeight = [...this.columnHeights].sort((a,b) => {return a-b;})[0]
    return this.columnHeights.indexOf(minHeight);
  }

  alignColumns() {
    const maxHeight = [...this.columnHeights].sort((a,b) => {return b-a;})[0];
    let c = 0;
    while (c < this.columns.length) {
      this.columns[c].style.height = `${maxHeight}px`;
      this.columns[c].style.justifyContent = 'space-between';
      c++;
    }
  }

  getScaledHeight(image) {
    const scale = this.columnWidth / image.width;
    return image.height * scale;
  }

  imagePromise(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }
}


customElements.define('image-display', ImageDisplay);
