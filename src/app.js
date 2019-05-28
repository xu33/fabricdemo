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

var canvas = new fabric.Canvas('c');
canvas.observe('mouse:down', function(e) {
  mousedown(e);
});
canvas.observe('mouse:move', function(e) {
  mousemove(e);
});
canvas.observe('mouse:up', function(e) {
  mouseup(e);
});

var started = false;
var x = 0;
var y = 0;
var drawing = true;

/* Mousedown */
function mousedown(e) {
  if (!drawing) {
    return;
  }
  console.log(e);
  var mouse = canvas.getPointer(e.e);
  started = true;
  x = mouse.x;
  y = mouse.y;

  var square = new fabric.Rect({
    width: 0,
    height: 0,
    left: x,
    top: y,
    fill: 'rgba(0,0,0,0)',
    strokeWidth: 1,
    stroke: '#000000'
  });

  canvas.add(square);
  canvas.renderAll();
  canvas.setActiveObject(square);
}

/* Mousemove */
function mousemove(e) {
  if (!drawing) {
    return;
  }

  if (!started) {
    return false;
  }

  var mouse = canvas.getPointer(e.e);

  var w = Math.abs(mouse.x - x),
    h = Math.abs(mouse.y - y);

  if (!w || !h) {
    return false;
  }

  var square = canvas.getActiveObject();
  square.set('width', w).set('height', h);
  canvas.renderAll();
}

/* Mouseup */
function mouseup(e) {
  if (!drawing) {
    return;
  }

  if (started) {
    started = false;
  }

  drawing = false;
  var square = canvas.getActiveObject();

  canvas.add(square);
  canvas.renderAll();
}
