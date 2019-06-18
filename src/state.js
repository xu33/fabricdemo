var drawingObject = {
  type: ""
};

var canvas = new fabric.Canvas("c", { preserveObjectStacking: true });
window.canvas = canvas;

// var canvas2 = new fabric.Canvas('d');
var work = [];
// canvas2.on('mouse:down', function(o) {
//   if (work.length > 0) {
//     alert('aaa');
//   } else {
//     console.log('do work');
//   }
// });

export { drawingObject, canvas, work };
