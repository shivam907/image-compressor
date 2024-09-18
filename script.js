const MAX_WIDTH = 500;
const MAX_HEIGHT = 500;
const MIME_TYPE = "image/jpeg";
const QUALITY = document.querySelector(".q2").textContent;

const input = document.getElementById("img-input");
input.onchange = function (ev) {
  document.querySelector(".convert").classList.remove("op");
  const file = ev.target.files[0]; // get the file
  const blobURL = URL.createObjectURL(file);
  // console.log(blobURL);
  const img = new Image();
  img.src = blobURL;
  img.onerror = function () {
    URL.revokeObjectURL(this.src);
    console.log("Cannot load image");
  };
  img.onload = function () {
    document.querySelector(".down").classList.remove("none")
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
      let a = document.querySelector(".link");
      let im = document.querySelector(".dimg");
      im.src = window.URL.createObjectURL(xhr.response);
      // im.style.width = 500;
      // im.style.height = 500;
      // document.body.appendChild(im);
      a.href = window.URL.createObjectURL(xhr.response);
      a.download=file.name
      document.querySelector(".fnm").textContent = file.name;
      // a.innerText = "Download";
      console.log(a.download);
      // document.body.appendChild(a);
    };
    xhr.open("GET", canvasImage);
    xhr.send();
    document.querySelector(".convert").classList.add("op");
    canvas.toBlob(
      (blob) => {
        // console.log(blob);
        let a= displayInfo("Original file", file);
        let b=displayInfo("Compressed file", blob, true);
        console.log(b)
        document.querySelector(".cp1").textContent=a;
        document.querySelector(".cp2").textContent=b;
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

function displayInfo(label, file, is=false) {
  // const p = document.createElement("p");
  return readableBytes(file.size, is);
  // document.getElementById("root").append(p);
}

function readableBytes(bytes, is) {
  const i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    if(is) return ((bytes / Math.pow(1024, i))*1.5).toFixed(2) + " " + sizes[i];
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}
const sliderEl = document.querySelector("#range");
const sliderValue = document.querySelector(".value");

sliderEl.addEventListener("input", (event) => {
  const tempSliderValue = event.target.value;
  document.querySelector(".q2").textContent = tempSliderValue;
  document.querySelector(".value").textContent = tempSliderValue;
  if (tempSliderValue >= 0.9 || tempSliderValue <= 0.1) {
    const e = document.querySelector("#qq");
    e.classList.remove("q4");
    e.classList.remove("q5");
    e.classList.add("q3");
    e.textContent = "(Not Recommended)";
  } else if (
    (tempSliderValue > 0.1 && tempSliderValue < 0.4) ||
    (tempSliderValue > 0.6 && tempSliderValue < 0.9)
  ) {
    const e = document.querySelector("#qq");
    e.classList.remove("q3");
    e.classList.remove("q4");
    e.classList.add("q5");
    e.textContent = "(Average)";
  } else {
    const e = document.querySelector("#qq");
    e.classList.remove("q3");
    e.classList.remove("q5");
    e.classList.add("q4");
    e.textContent = "(Recommended)";
  }
  const progress = (tempSliderValue / sliderEl.max) * 100;
  sliderEl.style.background = `linear-gradient(to right, #333 ${progress}%, #ccc ${progress}%)`;
});
const tempSliderValue = 0.5;
sliderValue.textContent = tempSliderValue;
const progress = (tempSliderValue / sliderEl.max) * 100;
sliderEl.style.background = `linear-gradient(to right, #333 ${progress}%, #ccc ${progress}%)`;
