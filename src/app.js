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

// // 边界限制
// canvas.on('object:moving', function(e) {
//   var obj = e.target;
//   // if object is too big ignore
//   if (
//     obj.currentHeight > obj.canvas.height ||
//     obj.currentWidth > obj.canvas.width
//   ) {
//     return;
//   }
//   obj.setCoords();
//   // top-left  corner
//   if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
//     obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
//     obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
//   }
//   // bot-right corner
//   if (
//     obj.getBoundingRect().top + obj.getBoundingRect().height >
//       obj.canvas.height ||
//     obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width
//   ) {
//     obj.top = Math.min(
//       obj.top,
//       obj.canvas.height -
//         obj.getBoundingRect().height +
//         obj.top -
//         obj.getBoundingRect().top
//     );
//     obj.left = Math.min(
//       obj.left,
//       obj.canvas.width -
//         obj.getBoundingRect().width +
//         obj.left -
//         obj.getBoundingRect().left
//     );
//   }
// });
// // canvas.on('mouse:down', function(options) {
// //   if (options.target) {
// //     console.log(options.target == rect);
// //   }
// // });

import $ from "jquery";
import Rect from "./rect";

var canvas = new fabric.Canvas("c");
var currentDrawingObject = null;
window.canvas = canvas;

$("#rect").on("click", function(e) {
  Rect.init();

  // if (currentDrawingObject) {
  //   currentDrawingObject.clear();
  // }

  currentDrawingObject = Rect;
});

$("#zoom").on("click", function(e) {
  canvas.setZoom(canvas.getZoom() * 1.1);
});

// var rect = new fabric.Rect({
//   width: 200,
//   height: 200,
//   left: 100,
//   top: 100,
//   fill: "rgba(0,0,0,0)",
//   strokeWidth: 1,
//   stroke: "#000000"
// });

// canvas.add(rect);
// canvas.renderAll();
