import { canvas } from './State';
import $ from 'jquery';
import { triggerLimit } from './Boundary';

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

    console.log('vpt now:', canvas.viewportTransform);
  };

  canvas.on('mouse:wheel', onWheel);

  var zoomEnable = false;
  $('#zoominout').on('click', function(e) {
    zoomEnable = !zoomEnable;

    $('#zoominout').html(zoomEnable ? '取消' : '缩放');
  });
};

export default { init };
