import { drawingObject } from './state';

var started = false;
var x = 0;
var y = 0;

/* Mousedown */
function mousedown(e) {
  console.log('mousedown fired');
  if (drawingObject.type != 'rect') {
    return;
  }
  var mouse = canvas.getPointer(e.e);
  started = true;
  x = mouse.x;
  y = mouse.y;

  var rect = new fabric.Rect({
    width: 0,
    height: 0,
    left: x,
    top: y,
    fill: 'rgba(0,0,0,0)',
    strokeWidth: 1,
    stroke: '#FFF'
  });

  canvas.add(rect);
  canvas.renderAll();
  canvas.setActiveObject(rect);

  console.log(canvas.getObjects().length);
}

/* Mousemove */
function mousemove(e) {
  if (drawingObject.type != 'rect') {
    return;
  }

  if (!started) {
    return false;
  }

  var mouse = canvas.getPointer(e.e);

  var w = Math.abs(mouse.x - x);
  var h = Math.abs(mouse.y - y);

  if (!w || !h) {
    return false;
  }

  var square = canvas.getActiveObject();
  square.set('width', w).set('height', h);

  canvas.renderAll();

  // console.log(canvas.getObjects().length);
}

/* Mouseup */
function mouseup(e) {
  if (drawingObject.type != 'rect') {
    return;
  }

  if (started) {
    started = false;
  }

  // canvas.renderAll();

  Rect.clear();
}

var Rect = {
  init: function({ onStart, onEnd }) {
    this.onStart = onStart || function() {};
    this.onEnd = onEnd || function() {};
    drawingObject.type = 'rect';
    // canvas.forEachObject(function(obj) {
    //   obj.set('selectable', false);
    // });
    // canvas.selection = false;

    canvas.on('mouse:down', mousedown);
    canvas.on('mouse:move', mousemove);
    canvas.on('mouse:up', mouseup);

    this.onStart();
  },
  clear: function() {
    // console.log(canvas.off);
    canvas.off('mouse:down', mousedown);
    canvas.off('mouse:move', mousemove);
    canvas.off('mouse:up', mouseup);

    // canvas.selection = true;

    // canvas.forEachObject(function(obj) {
    //   // console.log('type:', obj.type);
    //   obj.set('selectable', true);
    // });

    var rect = canvas.getActiveObject();
    rect.set('selectable', true);
    canvas.setZoom(1);

    drawingObject.type = '';

    this.onEnd();
  }
};

export default Rect;
