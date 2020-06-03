var mapWidth = 0;
var mapHeight = 0;
var zoomSettings = {
  min: 1.0,
  max: 2.5,
  value: 1.0,
  step: 0.05,
};
var dragSettings = {
  minX: 0,
  maxX: 0,
  minY: 0,
  maxY: 100,
  valueX: 0,
  valueY: 50,
  stepX: 1,
  stepY: 0.5,
};
var prevDragEvent = null;

var apartImgBox = document.getElementById("apartImg-box-js");
var markerContent1 = document.getElementById("marker-content-1-js");
var markerContent2 = document.getElementById("marker-content-2-js");
var markerBox1 = document.getElementById("marker-box-1-js");
var markerBox2 = document.getElementById("marker-box-2-js");
var markerHidden = document.getElementById("marker-hidden-js");

window.onload = function () {
  var computedStyle = window.getComputedStyle(apartImgBox, null);

  mapWidth = parseInt(computedStyle.width, 10);
  mapHeight = parseInt(computedStyle.height, 10);

  var range = (mapWidth - window.outerWidth) / 2;
  if (range < 0) range = range * -1;
  dragSettings.minX = zoomSettings.value * range * -1;
  dragSettings.maxX = zoomSettings.value * range;
  apartImgBox.addEventListener("wheel", _mapWheelHandler);
  apartImgBox.addEventListener("mousedown", _mapDragHandler);
  apartImgBox.addEventListener("touchstart", _mapTouchHandler);

  if (window.outerWidth > 725) {
    markerContent1.addEventListener("mouseover", _marker01Handler);
    markerContent2.addEventListener("mouseover", _marker02Handler);
    markerContent1.addEventListener("mouseout", _marker01Handler);
    markerContent2.addEventListener("mouseout", _marker02Handler);
    markerContent1.removeEventListener("click", _marker01Handler);
    markerContent2.removeEventListener("click", _marker02Handler);
  } else {
    markerContent1.addEventListener("click", _marker01Handler);
    markerContent2.addEventListener("click", _marker02Handler);
    markerContent1.removeEventListener("mouseover", _marker01Handler);
    markerContent2.removeEventListener("mouseover", _marker02Handler);
    markerContent1.removeEventListener("mouseout", _marker01Handler);
    markerContent2.removeEventListener("mouseout", _marker02Handler);
  }
  markerHidden.addEventListener("click", _markerHiddenHandler);

  window.addEventListener("resize", _resizeHandler);
};

function _mapWheelHandler(e) {
  let deltaY = 0;

  if (e.deltaY) {
    // FireFox 17+ (IE9+, Chrome 31+?)
    deltaY = e.deltaY;
  } else if (e.wheelDelta) {
    deltaY = -e.wheelDelta;
  }

  if (deltaY < 0) {
    zoomSettings.value =
      zoomSettings.value >= zoomSettings.max
        ? zoomSettings.max
        : zoomSettings.value + zoomSettings.step;
  } else {
    zoomSettings.value =
      zoomSettings.value <= zoomSettings.min
        ? zoomSettings.min
        : zoomSettings.value - zoomSettings.step;
  }

  var range = (mapWidth - window.outerWidth) / 2;
  if (range < 0) range = range * -1;
  dragSettings.minX = zoomSettings.value * range * -1;
  dragSettings.maxX = zoomSettings.value * range;

  apartImgBox.style.transform = `scale(${zoomSettings.value}) translate(${dragSettings.valueX}px, 0px)`;
}

function _mapDragHandler() {
  document.addEventListener("mousemove", _mapDragMoveHandler);
  document.addEventListener("mouseup", _mapDragRemoveHandler);
}

function _mapTouchHandler() {
  document.addEventListener("touchmove", _mapTouchMoveHandler);
  document.addEventListener("touchend", _mapTouchRemoveHandler);
}

function _mapDragMoveHandler(e) {
  e.preventDefault();

  if (prevDragEvent === null) prevDragEvent = e;

  if (e.pageX > prevDragEvent.pageX) {
    dragSettings.valueX =
      dragSettings.valueX >= dragSettings.maxX
        ? dragSettings.maxX
        : dragSettings.valueX + dragSettings.stepX;
  } else if (e.pageX < prevDragEvent.pageX) {
    dragSettings.valueX =
      dragSettings.valueX <= dragSettings.minX
        ? dragSettings.minX
        : dragSettings.valueX - dragSettings.stepX;
  }

  if (e.pageY < prevDragEvent.pageY) {
    dragSettings.valueY =
      dragSettings.valueY >= dragSettings.maxY
        ? dragSettings.maxY
        : dragSettings.valueY + dragSettings.stepY;
  } else if (e.pageY > prevDragEvent.pageY) {
    dragSettings.valueY =
      dragSettings.valueY <= dragSettings.minY
        ? dragSettings.minY
        : dragSettings.valueY - dragSettings.stepY;
  }

  prevDragEvent = e;

  apartImgBox.style.transform = `scale(${zoomSettings.value}) translate(${dragSettings.valueX}px, 0px)`;
  apartImgBox.style.transformOrigin = `50% ${dragSettings.valueY}%`;
}

function _mapTouchMoveHandler(e) {
  if (prevDragEvent === null) prevDragEvent = e.changedTouches[0];

  if (e.changedTouches[0].pageX === prevDragEvent.pageX) return;

  if (e.changedTouches[0].pageX > prevDragEvent.pageX) {
    dragSettings.valueX =
      dragSettings.valueX >= dragSettings.maxX
        ? dragSettings.maxX
        : dragSettings.valueX + (dragSettings.stepX + 9);
  } else if (e.changedTouches[0].pageX < prevDragEvent.pageX) {
    dragSettings.valueX =
      dragSettings.valueX <= dragSettings.minX
        ? dragSettings.minX
        : dragSettings.valueX - (dragSettings.stepX + 9);
  }

  if (e.changedTouches[0].pageY < prevDragEvent.pageY) {
    dragSettings.valueY =
      dragSettings.valueY >= dragSettings.maxY
        ? dragSettings.maxY
        : dragSettings.valueY + dragSettings.stepY;
  } else if (e.changedTouches[0].pageY > prevDragEvent.pageY) {
    dragSettings.valueY =
      dragSettings.valueY <= dragSettings.minY
        ? dragSettings.minY
        : dragSettings.valueY - dragSettings.stepY;
  }

  prevDragEvent = e.changedTouches[0];

  apartImgBox.style.transform = `scale(${zoomSettings.value}) translate(${dragSettings.valueX}px, 0px)`;
  apartImgBox.style.transformOrigin = `50% ${dragSettings.valueY}%`;
}

function _mapDragRemoveHandler() {
  document.removeEventListener("mouseup", _mapDragRemoveHandler);
  document.removeEventListener("mousemove", _mapDragMoveHandler);
}

function _mapTouchRemoveHandler() {
  document.removeEventListener("touchend", _mapTouchRemoveHandler);
  document.removeEventListener("touchmove", _mapTouchMoveHandler);
}

function _marker01Handler() {
  markerBox1.classList.toggle("active");
}

function _marker02Handler() {
  markerBox2.classList.toggle("active");
}

var markerShow = true;
function _markerHiddenHandler() {
  if (markerShow) {
    markerHidden.children[1].textContent = "핀 보이기";
    markerContent1.style.display = "none";
    markerContent2.style.display = "none";
    markerShow = false;
  } else {
    markerHidden.children[1].textContent = "핀 숨기기";
    markerContent1.style.display = "flex";
    markerContent2.style.display = "flex";
    markerShow = true;
  }
}

function _resizeHandler() {
  var range = (mapWidth - window.outerWidth) / 2;
  if (range < 0) range = range * -1;
  dragSettings.minX = zoomSettings.value * range * -1;
  dragSettings.maxX = zoomSettings.value * range;

  if (window.outerWidth > 725) {
    markerContent1.addEventListener("mouseover", _marker01Handler);
    markerContent2.addEventListener("mouseover", _marker02Handler);
    markerContent1.addEventListener("mouseout", _marker01Handler);
    markerContent2.addEventListener("mouseout", _marker02Handler);
    markerContent1.removeEventListener("click", _marker01Handler);
    markerContent2.removeEventListener("click", _marker02Handler);
  } else {
    markerContent1.addEventListener("click", _marker01Handler);
    markerContent2.addEventListener("click", _marker02Handler);
    markerContent1.removeEventListener("mouseover", _marker01Handler);
    markerContent2.removeEventListener("mouseover", _marker02Handler);
    markerContent1.removeEventListener("mouseout", _marker01Handler);
    markerContent2.removeEventListener("mouseout", _marker02Handler);
  }
}
