var canvas = (window._canvas = new fabric.Canvas('canvas', {
  preserveObjectStacking: true
}));

var height = [],
  width = [];

var imageObj = new Image(),
  path = 'http://i.imgur.com/tEeSJcr.jpg';

imageObj.src = path;

imageObj.onload = function() {
  var image = new fabric.Image(imageObj);

  height.push(imageObj.height);
  width.push(imageObj.width);
  canvas.setHeight(height);
  canvas.setWidth(width);
  image.set({
    id: 'img',
    left: 0,
    top: 0,
    selectable: true,
    hasBorders: false,
    hasControls: false,
    hasRotatingPoint: false
  });
  canvas.add(image);
};

canvas.on('object:moving', function(e) {
  var obj;

  obj = e.target;

  obj.setCoords();

  var boundingRect = obj.getBoundingRect();
  var zoom = canvas.getZoom();
  var viewportMatrix = canvas.viewportTransform;

  //there is a bug in fabric that causes bounding rects to not be transformed by viewport matrix
  //this code should compensate for the bug for now

  boundingRect.top = (boundingRect.top - viewportMatrix[5]) / zoom;
  boundingRect.left = (boundingRect.left - viewportMatrix[4]) / zoom;
  boundingRect.width /= zoom;
  boundingRect.height /= zoom;

  // if object is too big ignore

  if (
    obj.currentHeight * zoom > obj.canvas.height * zoom ||
    obj.currentWidth * zoom > obj.canvas.width * zoom
  ) {
    return;
  }

  var canvasHeight = obj.canvas.height / zoom,
    canvasWidth = obj.canvas.width / zoom,
    rTop = boundingRect.top + boundingRect.height,
    rLeft = boundingRect.left + boundingRect.width;

  // top-left  corner
  if (rTop < canvasHeight || rLeft < canvasWidth) {
    obj.top = Math.max(obj.top, canvasHeight - boundingRect.height);
    obj.left = Math.max(obj.left, canvasWidth - boundingRect.width);
  }

  // bot-right corner
  if (
    boundingRect.top + boundingRect.height > obj.canvas.height ||
    boundingRect.left + boundingRect.width > obj.canvas.width
  ) {
    obj.top = Math.min(
      obj.top,
      obj.canvas.height - boundingRect.height + obj.top - boundingRect.top
    );
    obj.left = Math.min(
      obj.left,
      obj.canvas.width - boundingRect.width + obj.left - boundingRect.left
    );
  }
  //canvas.sendToBack(canvas.getObjects()[0])
});

$('#zoomIn').click(function() {
  if (canvas.getZoom() < 3) {
    canvas.setZoom(canvas.getZoom() + 0.1);
  }
});

$('#zoomOut').click(function() {
  if (canvas.getZoom() != 1) {
    canvas.setZoom(canvas.getZoom() - 0.1);
  }
});
