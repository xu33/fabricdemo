import { drawingObject } from './State';
import { canvas } from './State';

var rect = null;
var drawStarted = false;
var x = 0;
var y = 0;

var handleMousedown = function(o) {
  if (drawingObject.type != 'rect') {
    return;
  }
  drawStarted = true;
  var mouse = canvas.getPointer(o.e);
  x = mouse.x;
  y = mouse.y;
  rect = new fabric.Rect({
    width: 0,
    height: 0,
    left: x,
    top: y,
    fill: 'rgba(0,0,0,0)',
    strokeWidth: 1,
    strokeUniform: true,
    stroke: '#FFF'
  });

  canvas.add(rect);
};

var handleMousemove = function(o) {
  if (drawingObject.type != 'rect') {
    return;
  }

  if (!drawStarted) {
    return false;
  }

  var mouse = canvas.getPointer(o.e);

  if (x > mouse.x) {
    rect.set({ left: Math.abs(mouse.x) });
  }
  if (y > mouse.y) {
    rect.set({ top: Math.abs(mouse.y) });
  }

  var w = Math.abs(x - mouse.x);
  var h = Math.abs(y - mouse.y);

  rect.set('width', w);
  rect.set('height', h);

  canvas.renderAll();

  // console.log(canvas.getObjects().length);
};

var handleMouseup = function() {
  if (drawingObject.type != 'rect') {
    return;
  }

  if (drawStarted) {
    drawStarted = false;
  }

  Rect.clear();
};

var Rect = {
  init: function({ onStart, onEnd }) {
    this.onStart = onStart || function() {};
    this.onEnd = onEnd || function() {};

    drawingObject.type = 'rect';

    canvas.on('mouse:down', handleMousedown);
    canvas.on('mouse:move', handleMousemove);
    canvas.on('mouse:up', handleMouseup);

    this.onStart();
  },
  clear: function() {
    canvas.off('mouse:down', handleMousedown);
    canvas.off('mouse:move', handleMousemove);
    canvas.off('mouse:up', handleMouseup);

    // 触发交互
    // canvas.setZoom(1);

    rect.setCoords();

    // 重置
    rect = null;
    drawingObject.type = '';
    drawStarted = false;
    x = 0;
    y = 0;

    this.onEnd();
  }
};

export default Rect;
