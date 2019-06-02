import { drawingObject } from './State';
import { canvas } from './State';

var counter = 0;
var group = null;
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

  var text = new fabric.Text('p' + counter++, {
    fontSize: 24,
    fill: '#FFF',
    originX: 'center',
    originY: 'center',
    left: roof.get('left') + roof.get('width') + 12,
    top: roof.get('top') + roof.get('height') / 2
  });

  group = new fabric.Group([], {
    left: roof.left,
    top: roof.top
  });
  group.hasRotatingPoint = false;
  group.addWithUpdate(roof);
  group.addWithUpdate(text);

  canvas.add(group);

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

    // 缩放细框处理
    // 1.缓存缩放后的矩阵
    // 2.还原缩放系数到1
    // 3.根据缩放后的矩阵计算新的多边形顶点坐标
    // 4.删除旧的图形和文字（直接更新旧的图形疑似有bug）
    // 5.添加新的图形和文字
    group.on('scaled', function(o) {
      var g = o.target;
      var scaleX = g.scaleX;
      var scaleY = g.scaleY;
      var matrix = g.calcTransformMatrix();

      // g.set('width', g.width * scaleX);
      // g.set('height', g.height * scaleY);
      var left = g.left;
      var top = g.top;
      g.set('scaleX', 1);
      g.set('scaleY', 1);

      var t = g.item(1);
      // t.set('width', t.width * scaleX);
      // t.set('height', t.height * scaleY);
      // t.set('left', t.get('left') * scaleX);
      // t.set('top', t.get('top') * scaleY);

      var p = g.item(0);

      var transformedPoints = p.points
        .map(function(pt) {
          return new fabric.Point(pt.x - p.pathOffset.x, pt.y - p.pathOffset.y);
        })
        .map(function(pt) {
          return fabric.util.transformPoint(pt, matrix);
        });
      var nextP = new fabric.Polygon(transformedPoints, {
        fill: 'rgba(0,0,0,0)',
        stroke: '#fff',
        strokeUniform: true,
        left: p.left,
        top: p.top
      });

      var nextT = new fabric.Text('p' + counter, {
        fontSize: 24,
        fill: '#FFF',
        originX: 'center',
        originY: 'center',
        left: nextP.left + nextP.width + 12,
        top: nextP.top + nextP.height / 2
      });

      g.remove(t);
      g.remove(p);

      g.addWithUpdate(nextP);
      g.addWithUpdate(nextT);

      g.set('left', left);
      g.set('top', top);

      console.log(g);

      g.setCoords();
    });

    // 重置
    drawingObject.type = '';
    roof = null;
    group = null;
    roofPoints = [];
    lines = [];
    lineCounter = 0;

    this.onEnd();
  }
};

export default Polygon;
