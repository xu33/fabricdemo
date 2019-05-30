import { canvas } from './State';
var limitImage = function(target) {
  // var left = target.get('left');
  // var top = target.get('top');
  // var canvasWidth = target.canvas.width;
  // var canvasHeight = target.canvas.height;
  // var { width, height } = target.getBoundingRect();

  // if (top > 0) {
  //   target.set('top', 0);
  // }

  // if (left > 0) {
  //   target.set('left', 0);
  // }
  // // console.log(width, target.get('width'));
  // if (width + left < canvasWidth && width > canvasWidth) {
  //   // console.log('reset left fired');
  //   left = canvasWidth - width;
  //   target.set('left', left);
  // }

  // if (height + top < canvasHeight && height > canvasHeight) {
  //   top = canvasHeight - height;
  //   target.set('top', top);
  // }

  target.setCoords();

  var boundingRect = target.getBoundingRect();
  var zoom = target.canvas.getZoom();
  var viewportMatrix = target.canvas.viewportTransform;

  console.log(
    boundingRect.left,
    target.left,
    target.get('left'),
    target.get('scaleX')
  );

  // boundingRect.top = (boundingRect.top - viewportMatrix[5]) / zoom;
  // boundingRect.left = (boundingRect.left - viewportMatrix[4]) / zoom;
  // boundingRect.width /= zoom;
  // boundingRect.height /= zoom;

  var canvasHeight = target.canvas.height / zoom,
    canvasWidth = target.canvas.width / zoom,
    rTop = boundingRect.top + boundingRect.height,
    rLeft = boundingRect.left + boundingRect.width;

  // top-left  corner
  // if (rTop < canvasHeight || rLeft < canvasWidth) {
  //   target.top = Math.max(target.top, canvasHeight - boundingRect.height);
  //   target.left = Math.max(target.left, canvasWidth - boundingRect.width);
  // }

  // // bot-right corner
  // if (
  //   boundingRect.top + boundingRect.height > target.canvas.height ||
  //   boundingRect.left + boundingRect.width > target.canvas.width
  // ) {
  //   target.top = Math.min(
  //     target.top,
  //     target.canvas.height - boundingRect.height + target.top - boundingRect.top
  //   );
  //   target.left = Math.min(
  //     target.left,
  //     target.canvas.width - boundingRect.width + target.left - boundingRect.left
  //   );
  // }
};

var limitShapes = function(obj) {
  // 调用此方法让控件位置重新计算
  obj.setCoords();

  var { top, left, width, height } = obj.getBoundingRect();
  var nextTop, nextLeft;

  // 左上角
  if (top < 0 || left < 0) {
    nextTop = Math.max(obj.top, obj.top - top);
    nextLeft = Math.max(obj.left, obj.left - left);

    obj.set('top', nextTop);
    obj.set('left', nextLeft);
  }

  // 右下角
  if (top + height > obj.canvas.height || left + width > obj.canvas.width) {
    nextTop = Math.min(obj.top, obj.canvas.height - height + obj.top - top);
    nextLeft = Math.min(obj.left, obj.canvas.width - width + obj.left - left);

    obj.set('top', nextTop);
    obj.set('left', nextLeft);
  }
};

// canvas.on('object:modified', function(o) {
//   console.log('object:modified fired');
// });

export default {
  init() {
    // 边界判断
    canvas.on('object:moving', function(e) {
      // console.log('object moving fired');
      var obj = e.target;
      if (obj.type === 'image') {
        limitImage(obj);
      } else {
        limitShapes(obj);
      }

      // console.log('vpt:', canvas.viewportTransform);
    });
  }
};
