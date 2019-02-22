"use strict";

document.addEventListener("DOMContentLoaded", init);

let img;

const ctx = document.querySelector(`#imageCanvas`).getContext(`2d`);
let w;
let h;
let colorInfo;
let myImageData;

let width = 500;
let height = 600;

let zoomData = null;

function init() {
  // loads the image in the DOM
  img = new Image();
  img.addEventListener("load", imgLoaded);
  img.src = "cat.jpg";
}

//now our image is loaded, then we can call on our
function imgLoaded() {
  ctx.drawImage(img, 0, 0);

  myImageData = getImageData();
  registerMouseMove();
  createZoomData();
  w = img.width;
  h = img.height;
}

function createZoomData() {
  zoomData = ctx.createImageData(10, 10);
}

function showZoomData() {
  zoomCtx.putImageData(zoomData, 0, 0);
}

function registerMouseMove() {
  colorInfo = document.querySelector("#imageCanvas");
  colorInfo.addEventListener("mousemove", mouseMoved);
}

function mouseMoved(e) {
  const x = e.offsetX;
  const y = e.offsetY;

  console.log(e);
  console.log(x, y);

  // this gives us the X an Y coordinats printet out on the screen
  let mouseXratio = (x / w) * 2 - 1;
  document.querySelector("#myXvalue").textContent = mouseXratio;
  let mouseYratio = (y / h) * 2 - 1;
  document.querySelector("#myYvalue").textContent = mouseYratio;

  ctx.putImageData(myImageData, 0, 0);
  drawRectangle(x, y);
}

function getColorAtPixel(x, y) {
  const pixelIndex = 4 * (x + y * width);
  const r = myImageData.data[pixelIndex]; //red
  const g = myImageData.data[pixelIndex + 1]; //green
  const b = myImageData.data[pixelIndex + 2]; //blue

  return { r, g, b };
}

//this here is our moving rectangle, the color and the size of the rectangle
function drawRectangle(x, y) {
  ctx.strokeStyle = "#FF05FF";
  ctx.strokeRect(x - 5, y - 5, 10, 10);
}

function getImageData() {
  return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// 🎁 Here you go! 🎁
function showColorInfo(rgb) {
  document.querySelector("#r").textContent = rgb.r;
  document.querySelector("#g").textContent = rgb.g;
  document.querySelector("#b").textContent = rgb.b;

  const hex =
    "#" +
    rgb.r.toString(16).padStart(2, "0") +
    rgb.g.toString(16).padStart(2, "0") +
    rgb.b.toString(16).padStart(2, "0");

  document.querySelector("#hex").textContent = hex;

  document.querySelector("#colorbox").style.backgroundColor = hex;
}
//
function copyPixels(startX, startY) {
  const w = zoomCtx.canvas.width;
  const imageW = ctx.canvas.width;

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const pixelIndex = (x + y * w) * 4;

      //this is the position of the curser(startX and startY) + variables from our 2 dimensional for loop.
      const imageX = startX + x;
      const imageY = startY + y;

      const imageIndex = (imageX + imageY * imageW) * 4;

      // this part gets the pixel position from our imageIndex and displays them in our zoomData.
      zoomData.data[pixelIndex + 0] = myImageData.data[imageIndex + 0]; //red
      zoomData.data[pixelIndex + 1] = myImageData.data[imageIndex + 1]; //green
      zoomData.data[pixelIndex + 2] = myImageData.data[imageIndex + 2]; //blue
      zoomData.data[pixelIndex + 3] = myImageData.data[imageIndex + 3]; //ALPHA
    }
  }
}
