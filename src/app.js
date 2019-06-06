import $ from 'jquery';
import { canvas } from './State';
import Polygon from './Polygon';
import Rect from './Rect';
import Image from './Image';
import Zoom from './Zoom';
import Boundary from './Boundary';

Image.init().then(() => {
  Zoom.init();
  Boundary.init();

  // var rect = new fabric.Rect({
  //   width: 200,
  //   height: 200,
  //   left: 100,
  //   top: 100,
  //   fill: 'rgba(0,0,0,0)',
  //   strokeWidth: 1,
  //   strokeUniform: true,
  //   stroke: '#fff'
  // });
  // canvas.add(rect);
  // canvas.renderAll();

  // 矩形
  $('#rect').on('click', function(e) {
    Rect.init({
      onStart: function() {
        console.log('onstart fired');
        Image.lock();
      },
      onEnd: function() {
        console.log('onend fired');
        Image.unlock();
      }
    });
  });

  // 多边形
  $('#poly').on('click', function(e) {
    Polygon.init({
      onStart: function() {
        console.log('onstart fired');
        Image.lock();
      },
      onEnd: function() {
        console.log('onend fired');
        Image.unlock();
      }
    });
  });

  // 删除选中
  $('#del').on('click', function(e) {
    // var activeObj = canvas.getActiveObject();
    // if (activeObj.type !== 'image') {
    //   canvas.remove(activeObj);
    // }

    Image.replace('demo2.jpg');
  });

  var enabled = false;
  $('#together').on('click', function(e) {
    enabled = !enabled;
    $(this).html('是否一起动:' + enabled);
    if (enabled) {
      Image.enableMoveTogether();
    } else {
      Image.disableMoveTogether();
    }
  });
});
