# dynamic-photo-display

This repository was made to provide a method of replicating `grid-template-rows: masonry;` for image displays, without needing to use a specific browser or enable any flags.

## Web component

The web component version can be found in `./web-component/`. This allows the component to be added into any page with ease.

### Setup

The `image-display` component has two attributes that should be set: `column-width`, which defines the width of each column; and `gap` which defines the minimum gap between each column, and each row. `column-width` defaults to `16rem`, and `gap` defaults to `0.5rem`.

Once the element has been added to the DOM, images will need to be supplied to it. This is done by calling its `fillColumns(images)` function, where `images` is a list of paths to load the required images from.

## Browser compatibility

I have tested this myself manually on different browsers and my findings are below:

|Browser|Version|Works?|Notes|
|---|---|---|---|
|Google Chrome|103|Yes|Built and tested for this browser.|
|Mozilla Firefox|101|Yes||
|Microsoft Edge|103|Yes||

## Future ideas

- Currently all images load as soon as the display is added to the DOM. Preferably something like lazy loading should be used to improve performance on slower connections.

## Image sources

All images used in this project are from [pexels.com](https://www.pexels.com)
