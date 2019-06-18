import { canvas } from "./State";

var imgInstance = null;
var mouseDownHandler = function(o) {
  if (o.target != imgInstance) {
    return;
  }
  var imgLeft = o.target.left;
  var imgTop = o.target.top;
  var oImg = o.target;

  oImg.on("moving", function(o) {
    var deltaLeft = o.target.left - imgLeft;
    var deltaTop = o.target.top - imgTop;

    canvas.forEachObject(function(obj) {
      if (obj != oImg) {
        if (!obj.prevLeft) {
          obj.prevLeft = obj.left;
          obj.prevTop = obj.top;
        }

        obj.left = obj.prevLeft + deltaLeft;
        obj.top = obj.prevTop + deltaTop;
        obj.setCoords();
      }
    });
  });

  canvas.on("mouse:up", function(o) {
    canvas.forEachObject(function(obj) {
      delete obj.prevLeft;
      delete obj.prevTop;
    });
    oImg.off("moving");
  });
};

var Image = {
  ready: false,
  init() {
    return new Promise(function(res) {
      fabric.Image.fromURL("demo.png", function(oImg) {
        // 禁止控件缩放图片
        oImg.lockScalingX = true;
        oImg.lockScalingY = true;
        oImg.lockUniScaling = true;
        oImg.lockRotation = true;
        oImg.hasRotatingPoint = false;
        Image.ready = true;

        canvas.add(oImg);
        canvas.oImg = oImg;

        imgInstance = oImg;
        console.log("imgInstance:", imgInstance);
        res();
      });
    });
  },
  lock() {
    imgInstance.lockMovementX = true;
    imgInstance.lockMovementY = true;
  },
  unlock() {
    imgInstance.lockMovementX = false;
    imgInstance.lockMovementY = false;
  },
  getInstance() {
    console.log("imginst", imgInstance);
    return imgInstance;
  },
  enableMoveTogether() {
    canvas.on("mouse:down", mouseDownHandler);
  },
  disableMoveTogether() {
    canvas.off("mouse:down", mouseDownHandler);
  },
  replace(url) {
    imgInstance.setSrc(
      url,
      function() {
        canvas.renderAll();
      },
      {}
    );
  }
};

export default Image;
