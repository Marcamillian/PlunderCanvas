(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// import the modules
var menuModule = require('./modules/MenuModule.js');

// app wide variables
var viewPort;
var viewPortDims = {
    height: 600,
    width: 400
}
viewPortDimUnits = {    // standardised to the ratio
    height: viewPortDims.height/600,
    width: viewPortDims.width/400
}
var keysDown = {};  // track the keys pressed
var then;   // track the last frame time

var init = function init(){
    // create the viewport
    var canvas = document.createElement("canvas");
    viewPort = canvas.getContext("2d");
    canvas.width = viewPortDims.width
    canvas.height = viewPortDims.height
    document.body.appendChild(canvas)

    menuModule.init(viewPortDimUnits)

    // configure the modules 
        // GameModule -
            // create the gameArea
            // set up players
            // get postions of the satellites
            // set up satellites
            // set up the message window -- make this part of the menu?
            // pass all of these to the gameController

    // kick off the mainLoop
    then = Date.now();
    mainLoop();
}

var mainLoop = function mainLoop(){
    var now = Date.now();
    var delta = now - then;

    update(delta/1000);
    render(viewPort);

    then = now

    requestAnimationFrame(mainLoop)
}

var update = function update(){
   // update the appropriate module
    // menu
    // tutorial
    // game

}

var render = function render(){

    menuModule.render(viewPort, {width:viewPortDims.width/100, height:viewPortDims.height/100 })
    // render the appropriate module
    // menu
    // tutorial
    // game
}

var setUpControls = function setUpControls(){

    // listen for keyDown
    addEventListener("keyDown", function(e){
        keysDown[e.keyCode] = true
    }, false);

    // listen for keyUp
    addEventListener("keyup", function(e){
            delete keysDown[e.keyCode];
    }, false);

}


module.exports = {
    init: init,
    mainLoop: mainLoop
}
},{"./modules/MenuModule.js":6}],2:[function(require,module,exports){
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

              canvasContext.fillStyle = state.colour; // set the right colour TODO: This should be color
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

module.exports = {
    stateReporter: stateReporter,
    renderable: renderable,
    turnToClick: turnToClick,
    moveToClick: moveToClick,
    reactToClick: reactToClick,
    mover: mover
}
},{}],3:[function(require,module,exports){
behaviours = require('./../behaviours.js');

const Button = function Button(arguments){
    
    state = {
         visible: true,
         colour: '#0000ff',
         rotation: 0,
         position: {x:arguments.pos.x, y: arguments.pos.y},
         size: {width: arguments.size.width, height: arguments.size.height}
    }

    return Object.assign(
        {},
        behaviours.renderable(state),
        behaviours.reactToClick(state, arguments.clickFunction)
    )
}

module.exports = Button
},{"./../behaviours.js":2}],4:[function(require,module,exports){
var behaviours = require('./../behaviours.js');

const FireButton = function FireButton(targetObject, triggerArgs){
    var state = {
        visible: true,
        colour: '#0000ff',
        position: {x:60, y:20},
        size: {width: 40, height:20}
    }
    var update = function update(){

    }
    var reset = function reset(){
        state.position = {x:60, y:20};
    }
    var clickFunction = function clickFunction(state, clickArgs){
        targetObject.trigger(targetObject.getState(), clickArgs); // HACKY WAY ROUND THE CLOSURE
    }
    var setPos = function setPos(position){
        state.position = position;
    }
    return Object.assign(
        {update:update,
        reset:reset,
        setPos:setPos},
        behaviours.renderable(state),
        behaviours.reactToClick(state, clickFunction)
    )
}

module.exports = FireButton;
},{"./../behaviours.js":2}],5:[function(require,module,exports){
var appManager = require('./AppManager.js');

init = function init(){
    appManager.init()
}
// -- launch order
// App Manager -- initiates the other states - holds the flow
    // Menu Manager-- draws the menu and holds the logic
    // Tutorial Manager -- draws the tutotial and holds the logic
    // Game Manager -- draws the game flow and holds the logic




},{"./AppManager.js":1}],6:[function(require,module,exports){
Button = require('./../gameObjects/Button.js')
FireButton = require('./../gameObjects/FireButton.js')


var objects = [];

const init = function init(dimUnits){
    
    var button = Button({
        pos: {x:dimUnits.width*50, y:dimUnits.height*50},//x: dimUnits.width*50, y: dimUnits.height*20},
        size: {width:dimUnits.width*20, height:dimUnits.height*20},//width: dimUnits.width*10, height:dimUnits*2.5},
        clickFunction: function(){console.log("Been Clicked")}
    })

    objects.push(button)
}

const update = function update(delta, keysPressed){
    console.log("updating")
}

const render = function render(ctx, dimUnits){

    // clear everything
    ctx.save()
    ctx.fillStyle = "#000000";
    ctx.fillRect(0,0,dimUnits.width*100, dimUnits.height*100);
    ctx.restore()

    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.translate(dimUnits.width*50, dimUnits.height*50)
    ctx.fillText("SOME MENU ITEM", 0,0)
    ctx.restore()

    objects.forEach((obj)=>{if(obj.draw){obj.draw(ctx)}})
}


module.exports = {
    init: init,
    update: update,
    render: render,
}
},{"./../gameObjects/Button.js":3,"./../gameObjects/FireButton.js":4}]},{},[5]);
