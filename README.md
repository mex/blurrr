blurrr
======

Node app to blur images. This app works as a proxy, where you pass along the original image URL as a GET parameter and the processed image will be returned.

## Requirements
 - [NodeJS](http://nodejs.org/)
 - GraphicsMagick (`brew install graphicsmagick`) or ImageMagick (`brew install imagemagick`)
 
_Note: If you are using ImageMagick, make sure to uncomment the line in the main file_

## Install
1. Clone this repository
2. Install dependencies (`npm install`)
3. Start server (`node index.js`)

You will now be able to access the app via `http://localhost:3000/?i=IMAGE_URL`.

## Interface
All endpoints under the host will work, only the GET parameters will be considered.

`i`: The URL of the image.  
`s`: The size (in pixels) of the processed image (default is 500).  
`r`: The radius (in pixels) of the blur effect (default is 20).  
`q`: The quality (in percentage) of the processed image (default is 80).  
`f`: Whether to force a bypass of the cache (any value including an empty string will trigger a bypass).
