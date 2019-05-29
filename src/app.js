// var canvas = new fabric.Canvas('c');
// // create a rectangle object
// var rect = new fabric.Rect({
//   left: 100,
//   top: 100,
//   fill: 'rgba(0,0,0,0)',
//   stroke: '#000',
//   strokeWidth: 1,
//   strokeUniform: true,
//   width: 100,
//   height: 100
// });

// // rect.set('selectable', false);

// // "add" rectangle onto canvas
// canvas.add(rect);

// canvas.on('mouse:down', function(options) {
//   if (options.target) {
//     console.log(options.target == rect);
//   }
// });

import $ from 'jquery';
import Rect from './rect';
import Image from './image';
var canvas = new fabric.Canvas('c', { preserveObjectStacking: true });

window.canvas = canvas;

Image.init().then(() => {
  // var rect = new fabric.Rect({
  //   width: 200,
  //   height: 200,
  //   left: 100,
  //   top: 100,
  //   fill: 'rgba(0,0,0,0)',
  //   strokeWidth: 1,
  //   strokeUniform: true,
  //   stroke: '#fff'
  // });
  // canvas.add(rect);
  // canvas.renderAll();

  // 绘制矩形
  $('#rect').on('click', function(e) {
    Rect.init({
      onStart: function() {
        Image.lock();
      },
      onEnd: function() {
        Image.unlock();
      }
    });
  });

  // 放大
  $('#zoom').on('click', function(e) {
    // canvas.setZoom(canvas.getZoom() * 1.1);
    canvas.forEachObject(obj => {
      obj.set('scaleX', obj.get('scaleX') * 1.1);
      obj.set('scaleY', obj.get('scaleY') * 1.1);
    });

    canvas.renderAll();
  });

  // 缩小
  $('#zoomin').on('click', function(e) {
    // canvas.setZoom(canvas.getZoom() * 1.1);
    canvas.forEachObject(obj => {
      obj.set('scaleX', obj.get('scaleX') / 1.1);
      obj.set('scaleY', obj.get('scaleY') / 1.1);
    });

    canvas.renderAll();
  });
});

// canvas.selection = false;
// rect.set('selectable', false);

// setTimeout(function() {
//   canvas.selection = true;
//   rect.set('selectable', true);
// }, 2000);

// 边界限制
canvas.on('object:moving', function(e) {
  var obj = e.target;
  if (obj.type === 'image') {
    return;
  }
  // if object is too big ignore
  if (
    obj.currentHeight > obj.canvas.height ||
    obj.currentWidth > obj.canvas.width
  ) {
    return;
  }
  // 调用此方法让控件位置重新计算
  obj.setCoords();
  // top-left  corner
  if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
    obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
    obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
  }
  // bot-right corner
  if (
    obj.getBoundingRect().top + obj.getBoundingRect().height >
      obj.canvas.height ||
    obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width
  ) {
    obj.top = Math.min(
      obj.top,
      obj.canvas.height -
        obj.getBoundingRect().height +
        obj.top -
        obj.getBoundingRect().top
    );
    obj.left = Math.min(
      obj.left,
      obj.canvas.width -
        obj.getBoundingRect().width +
        obj.left -
        obj.getBoundingRect().left
    );
  }
});
