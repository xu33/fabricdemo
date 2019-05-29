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
import Polygon from './Polygon';
import Rect from './Rect';
import Image from './Image';
import { canvas } from './State';

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

  // 矩形
  $('#rect').on('click', function(e) {
    Rect.init({
      onStart: function() {
        console.log('onstart fired');
        Image.lock();
      },
      onEnd: function() {
        console.log('onend fired');
        Image.unlock();
      }
    });
  });

  // 多边形
  $('#poly').on('click', function(e) {
    Polygon.init({
      onStart: function() {
        console.log('onstart fired');
        Image.lock();
      },
      onEnd: function() {
        console.log('onend fired');
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

var limitImage = function(o) {
  var target = o.target;

  if (target.top > 0) {
    target.top = 0;
  }

  if (target.left > 0) {
    target.left = 0;
  }
};

var limitShapes = function(o) {
  var obj = o.target;
  // 对象过大
  // if (
  //   obj.currentHeight > obj.canvas.height ||
  //   obj.currentWidth > obj.canvas.width
  // ) {
  //   return;
  // }
  // 调用此方法让控件位置重新计算
  obj.setCoords();

  var { top, left, width, height } = obj.getBoundingRect();

  // 左上角
  if (top < 0 || left < 0) {
    obj.top = Math.max(obj.top, obj.top - top);
    obj.left = Math.max(obj.left, obj.left - left);
  }

  // 右下角
  if (top + height > obj.canvas.height || left + width > obj.canvas.width) {
    obj.top = Math.min(obj.top, obj.canvas.height - height + obj.top - top);
    obj.left = Math.min(obj.left, obj.canvas.width - width + obj.left - left);
  }
};

// 边界判断
canvas.on('object:moving', function(e) {
  console.log('object moving fired');
  var obj = e.target;
  if (obj.type === 'image') {
    limitImage(e);
  } else {
    limitShapes(e);
  }
});
