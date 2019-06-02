var canvas = new fabric.Canvas('c');

var polygon = new fabric.Polygon(
  [
    new fabric.Point(200, 50),
    new fabric.Point(250, 150),
    new fabric.Point(150, 150)
  ],
  {
    objectCaching: false,
    fill: 'rgba(0,0,0,0)',
    stroke: '#000',
    strokeWidth: 1
  }
);

console.log(polygon.left, polygon.top);

var onScaled = function(o) {
  // console.log('scaled');
  var r = o.target;
  console.log(r.width, r.height, r.top, r.left);
  var matrix = r.calcTransformMatrix();
  console.log(matrix);
  // var scaleX = r.scaleX;
  // var scaleY = r.scaleY;
  // console.log(r.calcTransformMatrix());
  var transformedPoints = r.points
    .map(function(p) {
      return new fabric.Point(
        p.x - polygon.pathOffset.x,
        p.y - polygon.pathOffset.y
      );
    })
    .map(function(p) {
      return fabric.util.transformPoint(p, matrix);
    });
  // console.log(transformedPoints);
  // r.points = transformedPoints;
  // // console.log(transformedPoints);
  var p2 = new fabric.Polygon(transformedPoints, {
    fill: 'rgba(0,0,0,0)',
    stroke: '#000',
    strokeWidth: 1,
    left: r.left,
    top: r.top
  });
  canvas.add(p2);
  canvas.remove(polygon);
  polygon = p2;
  bindScaleEvent();
  canvas.renderAll();
  // // r.points = transformedPoints;
  // // r.width = r.width * scaleX;
  // // r.height = r.height * scaleY;
  // // console.log(r._calcDimensions());
  // // var dims = r._calcDimensions();
  // // r.width = dims.width;
  // // r.height = dims.height;
  // // r.scaleX = 1;
  // // r.scaleY = 1;
  // r.setCoords();
  // // updateDims(r);
  // // canvas.remove(r);
  // // // canvas.add(r);
  // // canvas.renderAll();
  // // console.log(r._calcDimensions());
  // // console.log(r, r.originX, r.originY);
  // // console.log(r.calcTransformMatrix());
  // // console.log(r.points);
};

var bindScaleEvent = function() {
  polygon.on('scaled', onScaled);
};

bindScaleEvent();
console.log(polygon.pathOffset);
canvas.add(polygon);
