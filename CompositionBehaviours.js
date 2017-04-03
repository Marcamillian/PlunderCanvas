//object assign polyfill --- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
if (typeof Object.assign != 'function') {
  Object.assign = function(target, varArgs) { // .length of function is 2
    'use strict';
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

const renderable = function renderable(state){
    return{
        draw: function draw(canvasContext){ // tick time = time between frames in miliseconds
            ctx.save()

            ctx.fillStyle = "#adff00"; // set the right colour
            ctx.translate(state.position.x - state.size.width/2, state.position.y - state.size.height/2) // move to the right position
            ctx.fillRect(0, 0, state.size.width, state.size.height); // draw the object

            ctx.restore()
        }
    }
}

