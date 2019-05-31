import { canvas } from './State';
import $ from 'jquery';
import { triggerLimit } from './Boundary';

// var zoomOut = function(e) {
//   var oImg = Image.getInstance();
//   console.log('width', oImg.get('width'));
//   canvas.setZoom(canvas.getZoom() * 1.1);
//   // canvas.forEachObject(obj => {
//   //   obj.set('scaleX', obj.get('scaleX') * 1.1);
//   //   obj.set('scaleY', obj.get('scaleY') * 1.1);
//   //   obj.setCoords();
//   // });

//   // canvas.renderAll();
//   // canvas.setCoords();

//   canvas.forEachObject(obj => {
//     obj.setCoords();
//   });

//   setTimeout(function() {
//     console.log('width', oImg.get('width'));
//   }, 100);
// };

// var zoomIn = function(e) {
//   // canvas.setZoom(canvas.getZoom() * 1.1);
//   canvas.forEachObject(obj => {
//     obj.set('scaleX', obj.get('scaleX') / 1.1);
//     obj.set('scaleY', obj.get('scaleY') / 1.1);
//     obj.setCoords();
//   });

//   canvas.renderAll();
// };

// // 放大
// $('#zoom').on('click', function(e) {
//   zoomOut();
// });

// // 缩小
// $('#zoomin').on('click', function(e) {
//   zoomIn();

//   var oImg = Image.getInstance();
//   var { width, height } = oImg.getBoundingRect();
//   if (width < canvas.width || height < canvas.height) {
//     zoomOut();
//   }
// });

var init = function() {
  var onWheel = function(opt) {
    opt.e.preventDefault();

    if (!zoomEnable) {
      return;
    }
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    // console.log('zoom:', zoom, delta);
    zoom = zoom + delta / 2000;
    if (zoom > 10) zoom = 10;
    if (zoom < 1) zoom = 1;
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);

    canvas.forEachObject(function(obj) {
      if (obj.type === 'image') {
        triggerLimit(obj);
      }
    });

    // console.log('vpt now:', canvas.viewportTransform);
  };

  canvas.on('mouse:wheel', onWheel);

  var zoomEnable = false;
  $('#zoominout').on('click', function(e) {
    zoomEnable = !zoomEnable;

    $('#zoominout').html(zoomEnable ? '取消' : '缩放');
  });
};

export default { init };
