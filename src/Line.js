var counter = 1;
var group = null;
var line = null;
var drawStarted = false;
var x = 0;
var y = 0;

var handleMousedown = function(o) {
  canvas.on('mouse:move', handleMousemove);
  canvas.on('mouse:up', handleMouseup);
  // canvas.on('mouse:out', handleMouseup);

  if (drawingObject.type != 'line') {
    return;
  }

  var mouse = canvas.getPointer(o.e);
  x = mouse.x;
  y = mouse.y;

  line = new fabric.Line([x, y, x, y], Object.assign({}, option));
  canvas.add(line);
};

var handleMousemove = function(o) {
  if (drawingObject.type != 'line') {
    return;
  }

  drawStarted = true;
  var mouse = canvas.getPointer(o.e);

  var w = Math.abs(x - mouse.x);
  var h = Math.abs(y - mouse.y);

  line.set('x2', Math.abs(mouse.x));
  line.set('y2', Math.abs(mouse.y));
  line.setCoords();

  var bound = line.getBoundingRect();
  if (bound.width + bound.left > canvas.width - 24) {
    w = canvas.width - bound.left - 24;
    line.set('width', w);
  }

  if (bound.height + bound.top > canvas.height) {
    h = canvas.height - bound.top;
    line.set('height', h);
  }
  canvas.renderAll();
};

var handleMouseup = function() {
  if (drawingObject.type != 'line') {
    return;
  }

  if (!drawStarted) {
    canvas.remove(line);
    gLine.clear();
    return false;
  }

  // line.originX = 'center';
  // line.originY = 'center';

  line.clone(function(cloned) {
    group = new fabric.Group(
      [],
      Object.assign(
        {
          left: line.left,
          top: line.top
        },
        option
      )
    );
    group.hasRotatingPoint = false;

    var text = new fabric.Text(
      'L' + counter++,
      Object.assign(
        {
          fontSize: 16,
          fill: '#FFF',
          left: group.get('left') + line.get('width') / 2,
          top: group.get('top') + line.get('height') / 2,
          originX: 'left',
          originY: 'center'
        },
        option
      )
    );

    group.addWithUpdate(cloned);
    group.addWithUpdate(text);

    // 删除矩形
    canvas.remove(line);
    canvas.add(group);
    gLine.clear();
  });
};

var gLine = {
  init: function({ onStart, onEnd, onScaled, onMoved }) {
    this.onStart = onStart || function() {};
    this.onEnd = onEnd || function(o) {};
    this.onScaled = onScaled || function(o) {};
    this.onMoved = onMoved || function(o) {};

    if (drawingObject.type != 'line') {
      drawingObject.type = 'line';
      canvas.on('mouse:down', handleMousedown);
    }
    this.onStart();
  },
  blur: function() {
    canvas.off('mouse:down', handleMousedown);
  },
  clear: function() {
    canvas.off('mouse:down', handleMousedown);
    canvas.off('mouse:move', handleMousemove);
    canvas.off('mouse:up', handleMouseup);

    if (drawStarted) {
      // 触发重绘
      group.setCoords();
      // 边框变粗处理
      group.on('scaled', o => {
        var g = o.target;
        var scaleX = g.scaleX;
        var scaleY = g.scaleY;

        g.set('width', g.width * scaleX);
        g.set('height', g.height * scaleY);

        g.forEachObject((t, i) => {
          t.set('width', t.width * scaleX);
          t.set('height', t.height * scaleY);
          t.set('left', t.get('left') * scaleX);
          t.set('top', t.get('top') * scaleY);
          if (i === 0) {
            // t.set('x1', t.get('x1') * scaleX);
            // t.set('y1', t.get('y1') * scaleY);
            // t.set('x2', t.get('x2') * scaleX);
            // t.set('y2', t.get('y2') * scaleY);
          }
        });

        g.set('scaleX', 1);
        g.set('scaleY', 1);
        g.setCoords();

        // console.log(g);
        this.onScaled(g);
      });

      group.on('moved', o => {
        this.onMoved(o.target);
      });
    }

    // 重置
    line = null;
    drawingObject.type = '';
    drawStarted = false;
    x = 0;
    y = 0;
    this.onEnd(group);
    group = null;
  },
  setCounter(value = 0) {
    counter = value;
  },
  getCounter() {
    return counter;
  },
  getGroup() {
    return group;
  }
};
export default gLine;
