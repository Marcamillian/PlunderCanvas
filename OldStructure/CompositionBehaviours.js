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

const stateReporter = function stateReporter(state){
  return{
    getState: function getState(){
      return state;
    }
  }
}

const renderable = function renderable(state, additionalRender){
    return{
        draw: function draw(canvasContext){ // tick time = time between frames in miliseconds
            if (state.visible){
              canvasContext.save()

              canvasContext.fillStyle = state.colour; // set the right colour
              canvasContext.translate(state.position.x , state.position.y) // move to the right position
              canvasContext.rotate( state.rotation * (Math.PI/180) );
              canvasContext.translate(- state.size.width/2, - state.size.height/2) // move to top left of object
              canvasContext.fillRect(0, 0, state.size.width, state.size.height); // draw the object
              canvasContext.translate( state.size.width/2, state.size.height); // move back to middle

              // make additional render steps if necessary
              if (additionalRender){
                additionalRender.forEach(function(renderFunction){ renderFunction(canvasContext, state) })
              }

              canvasContext.restore()
            }
        },
        toggleShow: function toggleShow(show){
          state.visible = (show === undefined) ? state.visible = !state.visible : show
        } 
    }
}

const turnToClick = function turnToClick(state){
  return{
    rotateToFace: function rotateToFace(clickPosition){ // click position {x:0 , y:0}
      var angle = this.getAngle2(clickPosition)
      state.rotation =  angle;
    },
    getAngle2: function getAngle(clickPosition){ // vertical = 0 degrees
      var deltaX = state.position.x - clickPosition.x;
      var deltaY = state.position.y - clickPosition.y;

      // if the differences are of the same sign                  :     // different sign
      var angle = ( deltaX*deltaY > 0 ) ? Math.atan(deltaY/deltaX) * (180/Math.PI) : Math.atan(deltaX/deltaY) * (180/Math.PI)
      angle = Math.abs(angle);
      
      // adjust for the different quadrants
      if( deltaX < 0){ // right side
        if (deltaY < 0 ){ angle += 90;  // bottom
        }else{ }  // top
      }else{  // left side
        if(deltaY < 0 ){ angle += 180 // bottom
        }else{ angle += 270} // top
      }

      return angle
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

const reactToClick = function reactToClick(state, clickFunction){
  return{
    runClick: function runClick(clickPosition, clickArgs){
      
      if( clickPosition.x < state.position.x - state.size.width/2
            || clickPosition.x > state.position.x + state.size.width/2){
              return false
      }
      if( clickPosition.y < state.position.y - state.size.height/2
            || clickPosition.y > state.position.y + state.size.height){
              return false
      }

      // if doesn't exit - do the thing
      clickFunction(state,clickArgs);

      return true

    }
  }
}

const mover = function mover(state){
  return {
    move: function move(timeDelta){
      state.position.x += state.speed.x * timeDelta;
      state.position.y += state.speed.y * timeDelta;
    },
    isActive: function isActive(){
      return state.active
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