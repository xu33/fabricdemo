import { canvas } from './State';

var imgInstance = null;
var mouseDownHandler = function(o) {
  if (o.target != imgInstance) {
    return;
  }
  var imgLeft = o.target.left;
  var imgTop = o.target.top;
  var oImg = o.target;

  oImg.on('moving', function(o) {
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
        // obj.setCoords();

        // obj.set('left', obj.left + deltaLeft);
        // obj.set('top', obj.top + deltaTop);
        obj.setCoords();
      }
    });
  });

  canvas.on('mouse:up', function(o) {
    canvas.forEachObject(function(obj) {
      delete obj.prevLeft;
      delete obj.prevTop;
    });
    oImg.off('moving');
  });
};

var Image = {
  init() {
    return new Promise(res => {
      fabric.Image.fromURL('demo.jpg', function(oImg) {
        // 禁止控件缩放图片
        oImg.lockScalingX = true;
        oImg.lockScalingY = true;
        oImg.lockUniScaling = true;
        oImg.lockRotation = true;
        oImg.hasRotatingPoint = false;
        imgInstance = oImg;

        canvas.add(oImg);
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
    return imgInstance;
  },
  enableMoveTogether() {
    canvas.on('mouse:down', mouseDownHandler);
  },
  disableMoveTogether() {
    canvas.off('mouse:down', mouseDownHandler);
  }
};

export default Image;
