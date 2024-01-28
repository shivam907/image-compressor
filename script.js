const MAX_WIDTH = 500;
const MAX_HEIGHT = 500;
const MIME_TYPE = "image/jpeg";
const QUALITY = 0.7;

const input = document.getElementById("img-input");
input.onchange = function (ev) {
  document.querySelector(".convert").classList.remove("op");
  const file = ev.target.files[0]; // get the file
  const blobURL = URL.createObjectURL(file);
  console.log(blobURL);
  const img = new Image();
  img.src = blobURL;
  img.onerror = function () {
    URL.revokeObjectURL(this.src);
    console.log("Cannot load image");
  };
  img.onload = function () {
    URL.revokeObjectURL(this.src);
    const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
    const canvas = document.createElement("canvas");
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
    console.log();
    const canvasImage = canvas.toDataURL();
    let xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = function () {
      let a = document.createElement("a");
      let im = document.createElement("img");
      im.src = window.URL.createObjectURL(xhr.response);
      im.style.width = 500;
      im.style.height = 500;
      document.body.appendChild(im);
      a.href = window.URL.createObjectURL(xhr.response);
      a.download = file.name;
      a.innerText = "Download";
      console.log(a);
      document.body.appendChild(a);
    };
    xhr.open("GET", canvasImage);
    xhr.send();
    document.querySelector(".convert").classList.add("op");
    canvas.toBlob(
      (blob) => {
        console.log(blob);
        displayInfo("Original file", file);
        displayInfo("Compressed file", blob);
      },
      MIME_TYPE,
      QUALITY
    );
  };
};

function calculateSize(img, maxWidth, maxHeight) {
  let width = img.width;
  let height = img.height;
  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    }
  } else {
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
  }
  return [width, height];
}

function displayInfo(label, file) {
  const p = document.createElement("p");
  p.innerText = `${label} - ${readableBytes(file.size)}`;
  document.getElementById("root").append(p);
}

function readableBytes(bytes) {
  const i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}
const sliderEl = document.querySelector("#range");
const sliderValue = document.querySelector(".value");

sliderEl.addEventListener("input", (event) => {
  const tempSliderValue = event.target.value;
  sliderValue.textContent = tempSliderValue;
  const progress = (tempSliderValue / sliderEl.max) * 100;
  sliderEl.style.background = `linear-gradient(to right, #333 ${progress}%, #ccc ${progress}%)`;
});
const tempSliderValue = 0.5;
sliderValue.textContent = tempSliderValue;
const progress = (tempSliderValue / sliderEl.max) * 100;
sliderEl.style.background = `linear-gradient(to right, #333 ${progress}%, #ccc ${progress}%)`;
