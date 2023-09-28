const inputs = document.querySelectorAll('input[type="range"]');
const outputs = document.querySelectorAll("output");
const btns = document.querySelectorAll(".btn");
const canvas = document.querySelector('canvas');
const base = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/';
const images = ['01.jpg', '02.jpg', '03.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
const fileInput = document.querySelector('input[type="file"]');
const imageContainer = document.querySelector("img");
const btnNext = document.querySelector('.btn-next');
const btnReset = document.querySelector('.btn btn-reset');
// INIT
document.addEventListener('DOMContentLoaded', () => {
   inputs.forEach(input => {
      if (input.name == "saturate") input.value = 100;
      else input.value = 0;
   });
});
//OPEN FILE
fileInput.addEventListener("change", function () {
   const file = fileInput.files[0];
   const reader = new FileReader();
   reader.onload = () => {
      const img = new Image();
      img.src = reader.result;
      imageContainer.innerHTML = "";
      imageContainer.src = reader.result;
   }
   reader.readAsDataURL(file);
});
function handleUpdate() {
   const suffix = this.dataset.sizing || '';
   imageContainer.style.setProperty(`--${this.name}`, this.value + suffix);
   this.nextElementSibling.value = this.value;
}
inputs.forEach(input => input.addEventListener('input', handleUpdate));

function viewImage(src) {
   const img = new Image();
   img.src = src;
   img.onload = () => {
      imageContainer.src = src;
   };
}
let i = 0;
btnNext.addEventListener('click', getImage);
function getImage() {
   const index = i % images.length;
   const time = new Date();
   let currentTime;
   if (time.getHours() >= 6 && time.getHours() < 12) currentTime = "morning/";
   else if (time.getHours() >= 12 && time.getHours() < 18) currentTime = "day/";
   else if (time.getHours() >= 18 && time.getHours() <= 23) currentTime = "evening/";
   else if (time.getHours() >= 0 && time.getHours() < 6) currentTime = "night/";
   const imageSrc = base + currentTime + images[index];
   viewImage(imageSrc);
   i++;
   btnNext.disabled = true;
   setTimeout(function () { btnNext.disabled = false }, 1000);
}
//ACTIVE / NO ACTIVE BUTTONS
btns.forEach(items => {
   items.addEventListener('click', switchLetter);
});
function switchLetter(e) {
   if (e.target.className == 'btn btn-reset' || e.target.className == 'btn btn-reset btn-active') {
      changeClass.call(this);
      imageContainer.style.setProperty(`--blur`, 0);
      imageContainer.style.setProperty(`--invert`, 0);
      imageContainer.style.setProperty(`--sepia`, 0);
      imageContainer.style.setProperty(`--saturate`, 1);
      imageContainer.style.setProperty(`--hue`, 0);
      inputs.forEach(item => {
         item.value = item.defaultValue;
      });
      outputs.forEach(item => {
         item.value = item.defaultValue;
      });
   }
   else if (e.target.className == 'btn btn-next') {
      changeClass.call(this);
   }
   else if (e.target.className == 'btn-load--input') {
      changeClass.call(this);
   }
   else if (e.target.className == 'btn btn-save' || e.target.className == 'btn btn-save btn-active') {
      changeClass.call(this);
      saveImage();
   }
}
function changeClass() {
   btns.forEach(items => {
      items.classList.remove('btn-active');
   });
   this.classList.add('btn-active');
}
//SAVE IMAGE
function saveImage() {
   const cnv = document.getElementById("canvas");
   cnv.width = imageContainer.width;
   cnv.height = imageContainer.height;
   const ctx = cnv.getContext("2d");
   const blur = imageContainer.style.getPropertyValue(`--blur`) || "0px";
   const invert = imageContainer.style.getPropertyValue(`--invert`) || "0%";
   const sepia = imageContainer.style.getPropertyValue(`--sepia`) || "0%";
   const saturate = imageContainer.style.getPropertyValue(`--saturate`) || "100%";
   const hue = imageContainer.style.getPropertyValue(`--hue`) || "0deg";
   const filter = "blur(" + blur + ")" + " sepia(" + sepia + ")" + " saturate(" + saturate + ")" + " hue-rotate(" + hue + ")" + " invert(" + invert + ")";
   ctx.filter = filter;
   ctx.drawImage(imageContainer, 0, 0, cnv.width, cnv.height);

   const link = document.createElement('a');
   link.download = 'download.png';
   link.href = cnv.toDataURL();
   link.click();
   link.delete;
}
//FULL SCREEN
document.querySelector('.fullscreen').addEventListener('click', () => {
   if (document.fullscreenElement === null) {
      document.documentElement.requestFullscreen();
   }
   else {
      if (document.fullscreenEnabled) {
         document.exitFullscreen();
      }
   }
});