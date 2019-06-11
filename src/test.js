var canvas = new fabric.Canvas("c");

// var polygon = new fabric.Polygon(
//   [
//     new fabric.Point(200, 50),
//     new fabric.Point(250, 150),
//     new fabric.Point(150, 150)
//   ],
//   {
//     objectCaching: false,
//     fill: 'rgba(0,0,0,0)',
//     stroke: '#000',
//     strokeWidth: 1
//   }
// );

// console.log(polygon.left, polygon.top);

// var onScaled = function(o) {
//   // console.log('scaled');
//   var r = o.target;
//   console.log(r.width, r.height, r.top, r.left);
//   var matrix = r.calcTransformMatrix();
//   console.log(matrix);
//   // var scaleX = r.scaleX;
//   // var scaleY = r.scaleY;
//   // console.log(r.calcTransformMatrix());
//   var transformedPoints = r.points
//     .map(function(p) {
//       return new fabric.Point(
//         p.x - polygon.pathOffset.x,
//         p.y - polygon.pathOffset.y
//       );
//     })
//     .map(function(p) {
//       return fabric.util.transformPoint(p, matrix);
//     });
//   // console.log(transformedPoints);
//   // r.points = transformedPoints;
//   // // console.log(transformedPoints);
//   var p2 = new fabric.Polygon(transformedPoints, {
//     fill: 'rgba(0,0,0,0)',
//     stroke: '#000',
//     strokeWidth: 1,
//     left: r.left,
//     top: r.top
//   });
//   canvas.add(p2);
//   canvas.remove(polygon);
//   polygon = p2;
//   bindScaleEvent();
//   canvas.renderAll();
//   // // r.points = transformedPoints;
//   // // r.width = r.width * scaleX;
//   // // r.height = r.height * scaleY;
//   // // console.log(r._calcDimensions());
//   // // var dims = r._calcDimensions();
//   // // r.width = dims.width;
//   // // r.height = dims.height;
//   // // r.scaleX = 1;
//   // // r.scaleY = 1;
//   // r.setCoords();
//   // // updateDims(r);
//   // // canvas.remove(r);
//   // // // canvas.add(r);
//   // // canvas.renderAll();
//   // // console.log(r._calcDimensions());
//   // // console.log(r, r.originX, r.originY);
//   // // console.log(r.calcTransformMatrix());
//   // // console.log(r.points);
// };

// var bindScaleEvent = function() {
//   polygon.on('scaled', onScaled);
// };

// bindScaleEvent();
// console.log(polygon.pathOffset);
// canvas.add(polygon);

var counter = 1;
var group = null;
var circle = null;
var drawStarted = false;
var x = 0;
var y = 0;
var drawingObject = { type: "circle" };

var handleMousedown = function(o) {
  canvas.on("mouse:move", handleMousemove);
  canvas.on("mouse:up", handleMouseup);
  // canvas.on('mouse:out', handleMouseup);

  if (drawingObject.type != "circle") {
    return;
  }

  var mouse = canvas.getPointer(o.e);
  x = mouse.x;
  y = mouse.y;

  circle = new fabric.Circle({
    left: x,
    top: y,
    fill: "#fff",
    stroke: "#000",
    originX: "center",
    originY: "center",
    radius: 0
  });

  circle.selectable = false;

  canvas.add(circle);
};

var handleMousemove = function(o) {
  if (drawingObject.type != "circle") {
    return;
  }

  drawStarted = true;
  var mouse = canvas.getPointer(o.e);

  var w = Math.abs(x - mouse.x);
  var h = Math.abs(y - mouse.y);
  var radius = Math.sqrt(w * w + h * h);
  circle.set({ radius: radius });

  var top = circle.top;
  var left = circle.left;
  if (radius > top || radius > left) {
    console.log("top exceed");
    var r = Math.min(radius, top, left);
    circle.set("radius", r);
  } else if (left + radius > canvas.width || top + radius > canvas.height) {
    console.log("bottom exceed");
    var r = Math.min(radius, canvas.width - left, canvas.height - top);
    circle.set("radius", r);
  }

  canvas.renderAll();
};

var handleMouseup = function() {
  if (drawingObject.type != "circle") {
    return;
  }

  if (!drawStarted) {
    canvas.remove(circle);
    return false;
  }

  circle.clone(function(cloned) {
    group = new fabric.Group([], {
      left: circle.left,
      top: circle.top
    });
    group.hasRotatingPoint = false;

    console.log(group.get("left"));
    console.log(group.get("top"));
    console.log(circle.get("radius"));

    var text = new fabric.Text("C" + counter++, {
      fontSize: 16,
      fill: "#FFF",
      left: group.get("left") + circle.get("radius"),
      top: group.get("top"),
      originX: "right",
      originY: "center"
    });

    group.addWithUpdate(cloned);
    group.addWithUpdate(text);

    // 删除矩形
    canvas.remove(circle);
    canvas.add(group);

    // reset
    // 重置
    circle = null;
    drawingObject.type = "";
    drawStarted = false;
    x = 0;
    y = 0;
    group = null;
  });
};

canvas.on("mouse:down", handleMousedown);

// fabric.Image.fromURL('demo.jpg', function(oImg) {
//   // 禁止控件缩放图片
//   oImg.lockScalingX = true;
//   oImg.lockScalingY = true;
//   oImg.lockUniScaling = true;
//   oImg.lockRotation = true;
//   oImg.hasRotatingPoint = false;
//   oImg.lockMovementX = true;
//   oImg.lockMovementY = true;
//   oImg.width = 600;
//   oImg.height = 600;

//   canvas.add(oImg);
//   setTimeout(() => {

//   }, 500);
// });

const small = 400;
const big = 700;
var bool = true;
document.body.addEventListener("dblclick", function(e) {
  var z;
  if (bool) {
    canvas.setDimensions({ width: big, height: big });

    z = big / small;
  } else {
    canvas.setDimensions({ width: small, height: small });

    z = small / big;
  }

  canvas.setZoom(z);

  var cacheMatrix = canvas.viewportTransform;

  canvas.viewportTransform = [1, 0, 0, 1, 0, 0];

  var g = canvas.item(0);
  var circle = g.item(0);
  var oldR = circle.get("radius");
  var oldLeft = g.get("left");
  var oldTop = g.get("top");
  var oh = g.get("height");
  var ow = g.get("width");
  var options = fabric.util.qrDecompose(cacheMatrix);

  console.log(options, oldTop, oldLeft);

  var newR = oldR * options.scaleX;
  var newLeft = oldLeft * options.scaleX + options.translateX;
  var newTop = oldTop * options.scaleY + options.translateY;
  var newWidth = ow * options.scaleX;
  var newHeight = oh * options.scaleY;

  console.log(newR, newLeft, newTop);

  g.set("left", newLeft);
  g.set("top", newTop);
  g.set("width", newWidth);
  g.set("height", newHeight);

  circle.set({
    radius: newR
  });

  g.setCoords();

  canvas.renderAll();

  bool = !bool;
});
