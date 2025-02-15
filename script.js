// Author: Hoang Tran (https://www.facebook.com/profile.php?id=100004848287494)
// Github verson (1 file .html): https://github.com/HoangTran0410/3DCarousel/blob/master/index.html

// Responsive variables
var radius = window.innerWidth < 480 ? 160 : 
             window.innerWidth < 768 ? 200 : 240;
var autoRotate = true;
var rotateSpeed = -60;
var imgWidth = window.innerWidth < 480 ? 80 : 
               window.innerWidth < 768 ? 100 : 120;
var imgHeight = window.innerWidth < 480 ? 120 : 
                window.innerWidth < 768 ? 150 : 170;

// Update dimensions on window resize
window.addEventListener('resize', () => {
  radius = window.innerWidth < 480 ? 160 : 
           window.innerWidth < 768 ? 200 : 240;
  imgWidth = window.innerWidth < 480 ? 80 : 
             window.innerWidth < 768 ? 100 : 120;
  imgHeight = window.innerWidth < 480 ? 120 : 
              window.innerWidth < 768 ? 150 : 170;
  init();
});

// Link of background music - set 'null' if you dont want to play background music
 // Show UI music control
/*
     NOTE:
       + imgWidth, imgHeight will work for video
       + if imgWidth, imgHeight too small, play/pause button in <video> will be hidden
       + Music link are taken from: https://hoangtran0410.github.io/Visualyze-design-your-own-/?theme=HauMaster&playlist=1&song=1&background=28
       + Custom from code in tiktok video  https://www.facebook.com/J2TEAM.ManhTuan/videos/1353367338135935/
*/


// ===================== start =======================
// animation start after 1000 miliseconds
setTimeout(init, 1000);

var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid]; // combine 2 arrays

// Size of images
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

// Size of ground - depend on radius
var ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

function init(delayTime) {
  for (var i = 0; i < aEle.length; i++) {
    aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
    aEle[i].style.transition = "transform 1s";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
  }
}

function applyTranform(obj) {
  // Constrain the angle of camera (between 0 and 180)
  if(tY > 180) tY = 180;
  if(tY < 0) tY = 0;

  // Apply the angle
  obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

function playSpin(yes) {
  ospin.style.animationPlayState = (yes?'running':'paused');
}

var sX, sY, nX, nY, desX = 0,
    desY = 0,
    tX = 0,
    tY = 10;

// auto spin
if (autoRotate) {
  var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
  ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
  
}

ospin.addEventListener("mouseover",()=>{
  playSpin(false);
  // add background music


})
ospin.addEventListener("mouseleave",()=>{
  playSpin(true);
})

// add background music


// setup events
document.onpointerdown = function (e) {
  clearInterval(odrag.timer);
  e = e || window.event;
  var sX = e.clientX,
      sY = e.clientY;

  this.onpointermove = function (e) {
    e = e || window.event;
    var nX = e.clientX,
        nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTranform(odrag);
    sX = nX;
    sY = nY;
  };

  this.onpointerup = function (e) {
    odrag.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTranform(odrag);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };

  return false;
};

document.onmousewheel = function(e) {
  e = e || window.event;
  var d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  init(1);
};

// Mobile touch events
let touchStartX, touchStartY;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  e.preventDefault();
});

document.addEventListener('touchmove', (e) => {
  if (!touchStartX || !touchStartY) return;
  
  let touchEndX = e.touches[0].clientX;
  let touchEndY = e.touches[0].clientY;
  
  let deltaX = touchEndX - touchStartX;
  let deltaY = touchEndY - touchStartY;
  
  tX += deltaX * 0.1;
  tY += deltaY * 0.1;
  applyTranform(odrag);
  
  touchStartX = touchEndX;
  touchStartY = touchEndY;
});

document.addEventListener('touchend', () => {
  touchStartX = null;
  touchStartY = null;
});

document.ondblclick = function(e) {
  e = e || window.event;
  var d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  init(1);
};
