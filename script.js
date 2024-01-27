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
    // var downloadLink = document.createElement("a");
    // downloadLink.target = "_blank";
    // downloadLink.download = file.name;
    // downloadLink.href = blobURL;

    // // append the anchor to document body
    // document.body.append(downloadLink);

    // // fire a click event on the anchor
    // downloadLink.click();

  const img = new Image();
  img.src = blobURL;
  img.onerror = function () {
    URL.revokeObjectURL(this.src);
    // Handle the failure properly
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
      im.src=window.URL.createObjectURL(xhr.response)
      // im=img
      im.style.width=500
      im.style.height=500
      document.body.appendChild(im)
      a.href = window.URL.createObjectURL(xhr.response);
      a.download = file.name;
      a.innerText="Download"
      console.log(a);
      // a.style.display = "none";
      document.body.appendChild(a);
      // a.click();
      // a.remove();
    };
    xhr.open("GET", canvasImage); // This is to download the canvas Image
    xhr.send();

    document.querySelector(".convert").classList.add("op");
    // document.getElementById("root").append(canvas);
    canvas.toBlob(
      (blob) => {
        console.log(blob)
        // Handle the compressed image. es. upload or save in local state
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

  // calculate the width and height, constraining the proportions
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

// Utility functions for demo purpose

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
