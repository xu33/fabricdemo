import { drawingObject } from './State';
import { canvas } from './State';

var counter = 1;
var group = null;
var rect = null;
var drawStarted = false;
var x = 0;
var y = 0;

var handleMousedown = function(o) {
  canvas.on('mouse:move', handleMousemove);
  canvas.on('mouse:up', handleMouseup);

  if (drawingObject.type != 'rect') {
    return;
  }

  var mouse = canvas.getPointer(o.e);
  x = mouse.x;
  y = mouse.y;

  rect = new fabric.Rect({
    left: x,
    top: y,
    width: 0,
    height: 0,
    fill: 'rgba(0,0,0,0)',
    stroke: '#FFF',
    strokeWidth: 1,
    strokeUniform: true
  });

  canvas.add(rect);
};

var handleMousemove = function(o) {
  if (drawingObject.type != 'rect') {
    return;
  }

  drawStarted = true;

  var mouse = canvas.getPointer(o.e);
  if (x > mouse.x) {
    rect.set({ left: Math.abs(mouse.x) });
  }
  if (y > mouse.y) {
    rect.set({ top: Math.abs(mouse.y) });
  }

  var w = Math.abs(x - mouse.x);
  var h = Math.abs(y - mouse.y);

  if (w + rect.left > canvas.width) {
    w = canvas.width - rect.left;
  }
  if (h + rect.top > canvas.height) {
    h = canvas.height - rect.top;
  }

  rect.set('width', w);
  rect.set('height', h);

  canvas.renderAll();
};

var handleMouseup = function() {
  if (drawingObject.type != 'rect') {
    return;
  }

  if (!drawStarted) {
    canvas.remove(rect);
    Rect.clear();
    return false;
  }

  // rect.originX = 'center';
  // rect.originY = 'center';

  rect.clone(function(cloned) {
    group = new fabric.Group([], {
      left: rect.left,
      top: rect.top
    });
    group.hasRotatingPoint = false;

    var text = new fabric.Text('r' + counter++, {
      fontSize: 24,
      fill: '#FFF',
      left: group.get('left') + rect.get('width') + 12,
      top: group.get('top') + rect.get('height') / 2,
      originX: 'center',
      originY: 'center'
    });

    group.addWithUpdate(cloned);
    group.addWithUpdate(text);

    // 删除矩形
    canvas.remove(rect);
    canvas.add(group);

    Rect.clear();
  });
};

var Rect = {
  init: function({ onStart, onEnd }) {
    this.onStart = onStart || function() {};
    this.onEnd = onEnd || function() {};

    drawingObject.type = 'rect';

    canvas.on('mouse:down', handleMousedown);

    this.onStart();
  },
  clear: function() {
    canvas.off('mouse:down', handleMousedown);
    canvas.off('mouse:move', handleMousemove);
    canvas.off('mouse:up', handleMouseup);

    if (drawStarted) {
      // 触发重绘
      group.setCoords();
      // 边框变粗处理
      group.on('scaled', function(o) {
        var g = o.target;
        var scaleX = g.scaleX;
        var scaleY = g.scaleY;

        g.set('width', g.width * scaleX);
        g.set('height', g.height * scaleY);

        g.forEachObject(t => {
          t.set('width', t.width * scaleX);
          t.set('height', t.height * scaleY);
          t.set('left', t.get('left') * scaleX);
          t.set('top', t.get('top') * scaleY);
        });

        g.set('scaleX', 1);
        g.set('scaleY', 1);
        g.setCoords();

        console.log(g);
      });
    }

    // 重置
    rect = null;
    group = null;
    drawingObject.type = '';
    drawStarted = false;
    x = 0;
    y = 0;

    this.onEnd();
  }
};

export default Rect;
