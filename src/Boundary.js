import { canvas } from "./State";
import Image from "./image";

export var checkImageExceed = function(obj) {
  obj.setCoords();
  var bound = obj.getBoundingRect();
  if (
    bound.left > 0 ||
    bound.top > 0 ||
    bound.left + bound.width < canvas.width ||
    bound.top + bound.height < canvas.height
  ) {
    return true;
  }

  return false;
};

var limitImage = function(obj) {
  obj.setCoords();

  // 获取不受zoom影响的bound
  var bound = obj.getBoundingRect();

  // 计算逆矩阵
  const rmatrix = fabric.util.invertTransform(canvas.viewportTransform);
  // 通过逆矩阵计算zoom之前的坐标在当前的位置
  var tl = fabric.util.transformPoint({ x: 0, y: 0 }, rmatrix);
  var br = fabric.util.transformPoint(
    {
      x: canvas.width - bound.width,
      y: canvas.height - bound.height
    },
    rmatrix
  );

  if (bound.left > 0) {
    console.log("left exceed");
    obj.left = tl.x;
  }

  if (bound.top > 0) {
    console.log("top exceed");
    obj.top = tl.y;
  }

  if (bound.left + bound.width < canvas.width) {
    console.log("right exceed");
    // console.log(obj.aCoords);
    obj.left = br.x;
  }

  if (bound.top + bound.height < canvas.height) {
    console.log("bottom exceed");
    obj.top = br.y;
  }
};

var limitShape = function(obj) {
  var img = canvas.oImg;
  obj.setCoords();

  var bound = obj.getBoundingRect(true);
  var imgBound = img.getBoundingRect(true);

  if (bound.left < imgBound.left) {
    obj.left = imgBound.left;
  }

  if (bound.top < imgBound.top) {
    obj.top = imgBound.top;
  }

  if (bound.left + bound.width > imgBound.left + imgBound.width) {
    obj.left = imgBound.left + imgBound.width - bound.width;
  }

  if (bound.top + bound.height > imgBound.top + imgBound.height) {
    obj.top = imgBound.top + imgBound.height - bound.height;
  }

  console.log(obj.left, obj.top, imgBound.left, imgBound.top);

  return;

  if (canvas.getZoom() > 1) {
    return;
  }
  obj.setCoords();
  // 获取不受zoom影响的bound
  var bound = obj.getBoundingRect();

  // 计算逆矩阵
  const rmatrix = fabric.util.invertTransform(canvas.viewportTransform);
  // 通过逆矩阵计算zoom之前的坐标在当前的位置
  var tl = fabric.util.transformPoint({ x: 0, y: 0 }, rmatrix);
  var br = fabric.util.transformPoint(
    {
      x: canvas.width - bound.width,
      y: canvas.height - bound.height
    },
    rmatrix
  );

  if (bound.left < 0) {
    console.log("left exceed");

    obj.left = tl.x;
  }

  if (bound.top < 0) {
    console.log("top exceed");

    obj.top = tl.y;
  }

  if (bound.left + bound.width > canvas.width) {
    console.log("right exceed");
    // console.log(obj.aCoords);
    obj.left = br.x;
  }

  if (bound.top + bound.height > canvas.height) {
    console.log("bottom exceed");
    obj.top = br.y;
  }
};

export var triggerLimit = function(obj) {
  if (obj.type === "image") {
    limitImage(obj);
  } else {
    limitShape(obj);
  }
};

export default {
  init() {
    // 边界判断
    canvas.on("object:moving", function(e) {
      var obj = e.target;
      if (obj.type === "image") {
        limitImage(obj);
      } else {
        limitShape(obj);
      }
    });
  }
};
