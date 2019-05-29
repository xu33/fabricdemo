import { drawingObject } from './State';
import { canvas } from './State';

var roof = null;
var roofPoints = [];
var lines = [];
var lineCounter = 0;
var x = 0;
var y = 0;

var handleMousedown = function(options) {
  if (drawingObject.type == 'roof') {
    canvas.selection = false;

    setStartingPoint(options);

    roofPoints.push({ x, y });
    var points = [x, y, x, y];
    lines.push(
      new fabric.Line(points, {
        strokeWidth: 1,
        selectable: false,
        stroke: '#FFF',
        strokeUniform: true
      })
    );
    canvas.add(lines[lineCounter]);
    lineCounter++;
  }
};

var handleMousemove = function(options) {
  if (
    lines[0] !== null &&
    lines[0] !== undefined &&
    drawingObject.type == 'roof'
  ) {
    setStartingPoint(options);
    lines[lineCounter - 1].set({
      x2: x,
      y2: y
    });
    canvas.renderAll();
  }
};

var handleMouseup = function() {
  canvas.selection = true;
};

var setStartingPoint = function(o) {
  var mouse = canvas.getPointer(o.e);
  x = mouse.x;
  y = mouse.y;
};

var makeRoof = function(roofPoints) {
  var left = findLeftPaddingForRoof(roofPoints);
  var top = findTopPaddingForRoof(roofPoints);
  roofPoints.push({ x: roofPoints[0].x, y: roofPoints[0].y });
  var roof = new fabric.Polyline(roofPoints, {
    fill: 'rgba(0,0,0,0)',
    stroke: '#fff',
    strokeUniform: true
  });
  roof.set({
    left: left,
    top: top
  });

  return roof;
};

var findTopPaddingForRoof = function(roofPoints) {
  var result = Infinity;
  for (var f = 0; f < lineCounter; f++) {
    if (roofPoints[f].y < result) {
      result = roofPoints[f].y;
    }
  }
  return Math.abs(result);
};

var findLeftPaddingForRoof = function(roofPoints) {
  var result = Infinity;
  for (var i = 0; i < lineCounter; i++) {
    if (roofPoints[i].x < result) {
      result = roofPoints[i].x;
    }
  }
  return Math.abs(result);
};

var handleDoubleClick = function(e) {
  lines.forEach(function(value, index, ar) {
    canvas.remove(value);
  });
  roof = makeRoof(roofPoints);
  canvas.add(roof);
  canvas.renderAll();

  Polygon.clear();
};

var noop = function() {};

var Polygon = {
  init: function({ onStart, onEnd }) {
    this.onStart = onStart || noop;
    this.onEnd = onEnd || noop;

    drawingObject.type = 'roof';

    canvas.on('mouse:down', handleMousedown);
    canvas.on('mouse:move', handleMousemove);
    canvas.on('mouse:up', handleMouseup);

    window.addEventListener('dblclick', handleDoubleClick);

    this.onStart();
  },
  clear: function() {
    canvas.off('mouse:down', handleMousedown);
    canvas.off('mouse:move', handleMousemove);
    canvas.off('mouse:up', handleMouseup);
    window.removeEventListener('dblclick', handleDoubleClick);

    // 重置
    drawingObject.type = '';
    roof = null;
    roofPoints = [];
    lines = [];
    lineCounter = 0;

    this.onEnd();
  }
};

export default Polygon;
