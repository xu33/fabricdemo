import { canvas } from './State';
import $ from 'jquery';
import { checkImageExceed } from './Boundary';

var init = function() {
  var onWheel = function(opt) {
    opt.e.preventDefault();

    if (!zoomEnable) {
      return;
    }

    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    var prevZoom = zoom;

    zoom = zoom + delta / 2000;
    if (zoom > 10) zoom = 10;
    if (zoom < 1) zoom = 1;
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);

    var imgObj;
    canvas.forEachObject(function(obj) {
      if (obj.type === 'image') {
        imgObj = obj;
      }
    });

    if (checkImageExceed(imgObj)) {
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, prevZoom);
    }
  };

  canvas.on('mouse:wheel', onWheel);

  var zoomEnable = false;
  $('#zoominout').on('click', function(e) {
    zoomEnable = !zoomEnable;

    $('#zoominout').html(zoomEnable ? '取消' : '缩放');
  });
};

export default { init };
