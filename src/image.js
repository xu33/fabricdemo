import { canvas } from './State';

var imgInstance = null;
var Image = {
  init() {
    return new Promise(res => {
      fabric.Image.fromURL('demo.jpg', function(oImg) {
        // 禁止控件缩放图片
        oImg.lockScalingX = true;
        oImg.lockScalingY = true;
        oImg.lockUniScaling = true;
        oImg.lockRotation = true;

        imgInstance = oImg;
        canvas.add(oImg);

        console.log(oImg.calcOwnMatrix());

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
  }
};

export default Image;
