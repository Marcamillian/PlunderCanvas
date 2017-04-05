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

            ctx.fillStyle = state.colour; // set the right colour
            ctx.translate(state.position.x , state.position.y) // move to the right position
            ctx.rotate( state.rotation * (Math.PI/180) );
            ctx.translate(- state.size.width/2, - state.size.height/2) // move to top left of object
            ctx.fillRect(0, 0, state.size.width, state.size.height); // draw the object
            ctx.restore()
        }
    }
}

const turnToClick = function turnToClick(state){
  return{
    rotateToFace: function rotateToFace(clickPosition){ // click position {x:0 , y:0}
      var deltaX = state.position.x - clickPosition.x;
      var deltaY = state.position.y - clickPosition.y;

      state.rotation =  (deltaX == 0 )? 0: 
                          ( deltaY == 0) ? 90 :
                            (Math.atan(deltaY/deltaX) * (180/Math.PI)) + 90; // not sure why the 90 is necessary
    }
  }
}

const moveToClick = function moveToClick(state){
  return{
    moveTo: function moveTo(clickPosition){
      state.position = {x: clickPosition.x, y: clickPosition.y}
    }
  }
}

const reactToClick = function reactToClick(state){
  return{
    runClick: function runClick(clickPosition,clickFunction){
      if( clickPosition.x < state.position.x - state.size.width/2
            || clickPosition.x > state.position.x + state.size.width/2){
              return
      }
      if( clickPosition.y < state.position.y - state.size.height/2
            || clickPosition.y > state.position.y + state.size.height){
              return
      }

      // if doesn't exit - do the thing
      clickFunction(state);

    }
  }
}
/* testcases for turnToClick
console.log( "rotate test 1 : ",
  turnToClick(
    { position:{x:0, y:0} }
  ).rotate(
      {x:-50, y:-50}
    )
)*/