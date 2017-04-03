
/// START OF COMPOSITION TRIALS

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



// === compositional behaviour types == 
// renderable composition 
const renderable = function renderable(state){ 
    return{
      draw: function draw(){
          console.log("drawing ", state.image, " at ", state.position.x, ",", state.position.y);
      } 
    }
}

/*
var testing = renderable({image:"a tree", position:{x:5, y:5}});
testing.draw();
*/

const tickUpdatable = function tickUpdatable(state){
    return{
      update: function update(){
        console.log("updating", state.name);
      }
    }
}


// TESTING THIS OUT
const testObject = function testObject(image,name){
    state = {
        'image':image,
        'position':{x:5, y:6},
        'name':name
    }
    return Object.assign(
        {},
        renderable(state),
        tickUpdatable(state)
    )
}

var player1 = testObject("dig.gif", "charles");

player1.draw();
player1.update();
// == END OF COMPOSITION TRIALS