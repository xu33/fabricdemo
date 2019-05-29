import { canvas } from './State';

var imgInstance = null;
var Image = {
  init() {
    return new Promise(res => {
      fabric.Image.fromURL('demo.jpg', function(oImg) {
        imgInstance = oImg;

        // 禁止控件缩放图片
        oImg.lockScalingX = true;
        oImg.lockScalingY = true;
        oImg.lockUniScaling = true;
        oImg.lockRotation = true;

        // oImg.on('moving', function(options) {
        //   var target = options.target;

        //   if (target.top > 0) {
        //     target.top = 0;
        //   }

        //   if (target.left > 0) {
        //     target.left = 0;
        //   }
        //   // oImg.moveTo(0);
        //   // canvas.renderAll();
        // });

        // canvas.on('mouse:up', function(options) {
        // canvas.forEachObject(function(obj) {
        //   if (obj === oImg) {
        //     console.log('not do thing');
        //     obj.sendToBack();
        //     return;
        //   }
        //   // console.log(obj);
        //   // obj.moveTo(999);
        // });
        // canvas.sendToBack(oImg);
        // canvas.sendToBack(oImg);
        // oImg.moveTo(0);
        // canvas.renderAll();
        // });

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
  }
};

export default Image;
