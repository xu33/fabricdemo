import { currentType } from "./state";

var started = false;
var x = 0;
var y = 0;

/* Mousedown */
function mousedown(e) {
  console.log("mousedown fired");
  var mouse = canvas.getPointer(e.e);
  started = true;
  x = mouse.x;
  y = mouse.y;

  var rect = new fabric.Rect({
    width: 0,
    height: 0,
    left: x,
    top: y,
    fill: "rgba(0,0,0,0)",
    strokeWidth: 1,
    stroke: "#000000"
  });

  canvas.add(rect);
  canvas.renderAll();
  canvas.setActiveObject(rect);

  console.log(canvas.getObjects().length);
}

/* Mousemove */
function mousemove(e) {
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
  square.set("width", w).set("height", h);

  canvas.renderAll();

  // console.log(canvas.getObjects().length);
}

/* Mouseup */
function mouseup(e) {
  if (started) {
    started = false;
  }

  // var square = canvas.getActiveObject();

  // canvas.add(square);
  canvas.renderAll();

  Rect.clear();
}

var Rect = {
  init: function() {
    canvas.getObjects().forEach(function(obj) {
      obj.set("selectable", false);
    });
    canvas.selection = false;

    canvas.on("mouse:down", mousedown);
    canvas.on("mouse:move", mousemove);
    canvas.on("mouse:up", mouseup);
  },
  clear: function() {
    canvas.off("mouse:down", mousedown);
    canvas.off("mouse:move", mousemove);
    canvas.off("mouse:up", mouseup);

    setTimeout(function() {
      canvas.selection = true;

      canvas.getObjects().forEach(function(obj) {
        obj.set("selectable", true);
      });

      canvas.renderAll();
    }, 100);
  }
};

export default Rect;
