(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// import the modules
var MenuModule = require('./modules/MenuModule.js');
var GameModule = require('./modules/GameModule.js');

// app wide variables
var viewPort;
var viewPortDims = {
    height: 600,
    width: 400
}
var viewPortDimUnits = {    // standardised to the ratio
    height: viewPortDims.height/600,
    width: viewPortDims.width/400
}

// input variables
var keysDown = {};  // track the keys pressed

// timing variables
var then;   // track the last frame time

// module instance
var gameModule = GameModule(viewPortDimUnits)
var menuModule = MenuModule(viewPortDimUnits)
// moduleManagement
var activeModule = menuModule;

var init = function init(){
    // create the viewport
    var canvas = document.createElement("canvas");
    viewPort = canvas.getContext("2d");
    canvas.width = viewPortDims.width
    canvas.height = viewPortDims.height
    document.body.appendChild(canvas)

    setUpControls(canvas)
        
    // configure the modules 
        // GameModule -


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

var update = function update(timeStep){

    // handle all of the AppManagers inputs first
    if(keysDown[77]){
        changeModules()
        delete keysDown[77]
    }

    // update the active module
    activeModule.update(timeStep, keysDown);    
    
   // update the appropriate module
    // menu
    // tutorial
    // game

}

var render = function render(){

    //menuModule.render(viewPort, {width:viewPortDims.width/100, height:viewPortDims.height/100 })
    activeModule.render(viewPort)
    
    // render the appropriate module
    // menu
    // tutorial
    // game
}

var setUpControls = function setUpControls(canvas){
    // listen for keyDown
    window.addEventListener("keydown", function(e){
        keysDown[e.keyCode] = true
    }, false);

    // listen for keyUp
    window.addEventListener("keyup", function(e){
            delete keysDown[e.keyCode];
    }, false);

    // add the event listeners for the mouse clicks
    canvas.addEventListener("mousedown", function(e){
        keysDown["click"] = e;
    })
    canvas.addEventListener("mouseup", function(e){
        delete keysDown["click"];
        delete keysDown["move"];
    })
    canvas.addEventListener("mousemove", function(e){
        keysDown["move"] = e;
    })

}

var changeModules = function changeModules(){
    return activeModule = (activeModule == menuModule) ? gameModule : menuModule
}
module.exports = {
    init: init,
    mainLoop: mainLoop
}
},{"./modules/GameModule.js":13,"./modules/MenuModule.js":14}],2:[function(require,module,exports){
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

// OBJECT FOR WHERE YOU CLICK 
const ClickMarker = function ClickMarker(){
    var state = {
        colour: '#ff69b4',
        visible:true,
        position: { x:20, y:20},
        size: {width:10, height:10}
    }
    return Object.assign(
        {},
        behaviours.renderable(state),
        behaviours.moveToClick(state)
    )
}

module.exports = ClickMarker;
},{"./../behaviours.js":2}],5:[function(require,module,exports){
var behaviours = require('./../behaviours.js');

const FireButton = function FireButton(position, targetObject, triggerArgs){
    var state = {
        visible: true,
        colour: '#0000ff',
        position: {x:60, y:20},
        size: {width: 40, height:20}
    }
    // !! INIT STRAIGHT AWAY
    var init = function init(position){
        state.position.x = position.x;
        state.position.y = position.y
    }(position)
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
},{"./../behaviours.js":2}],6:[function(require,module,exports){
var behaviours = require('./../behaviours.js');

const GameArea = function GameArea(Ux, Uy){
    var state = {
        screenSize:{
            width: undefined,
            height: undefined
        },
        gutters: {
            side:undefined,
            top:undefined
        },
        satFieldSize: {
            width: undefined,
            height:undefined
        },
        satelliteSpacing: {
            x: undefined,
            y: undefined,
        },
        playerPos:{
            p1: {
                x: undefined,
                y: undefined
            },
            p2: {
                x: undefined,
                y: undefined
            }
        }

    }
    
    // !! CALL INIT STRAIGHT AWAY
    var init = function init(Ux, Uy){
        // overall screen size
        state.screenSize = {width: 400*Ux, height: 600*Uy}

        // guters at the side so satellites arn't right on the edge
        state.gutters = {
            side:0*Ux,
            top:50*Uy
        }

        // screen with the gutters taken out
        state.satFieldSize = {
            width: 400*Ux - 2*state.gutters.side,
            height: 600*Uy - 2*state.gutters.top
        }

        //satellite spacing
        state.satelliteSpacing = {
            x: state.satFieldSize.width/4,
            y: state.satFieldSize.height/4
        }

        // player placement
        state.playerPos.p1.x = state.screenSize.width/2
        state.playerPos.p1.y = state.gutters.top/2;
        state.playerPos.p2.x = state.screenSize.width/2
        state.playerPos.p2.y = state.screenSize.height - state.gutters.top/2;

    }(Ux, Uy)

    var reset = function reset(){ // reset the areas for screen re-draw/ re-size

    }
    var update = function update(){ // function to update all of the game functions

    }
    var inBounds = function(position){
        return (position.x > 5 && position.x < state.satFieldSize.width -5
                && position.y > 5 && position.y < state.satFieldSize.height - 5) ? true : false
    }
    var getFieldSize = function getFieldSize(){
        return state.satFieldSize;
    }
    var gridPositions = function gridPositions(){
        
        var positions = [];

        // setup satellites
        for (var i = 0; i < 16 ; i++){  // rows
            positions.push({});
            positions[i].x = (state.satelliteSpacing.x /2) + i%4 * (state.satelliteSpacing.x);
            positions[i].y = (state.satelliteSpacing.y /2)+ Math.floor(i/4)*(state.satelliteSpacing.y);
        }

        return positions.map(function(position){
            return {
                x: position.x + state.gutters.side, // adding on the surrounding area
                y: position.y + state.gutters.top
            }
        });
    }
    var activeSatellites = function activeSatellites(position){

        var sats = []
        var satForces = {};
        var column = Math.floor( ( (position.x - state.gutters.side) / state.satelliteSpacing.x) -0.5) + 1 ;
        var row = Math.floor( ( (position.y - state.gutters.top) / state.satelliteSpacing.y) -0.5 ) + 1;

        if( column < 1 ){ satForces.right = true;
        }else if(column > 3){satForces.left = true
        }else{ satForces.right = true, satForces.left = true}

        if( row < 1 ){ satForces.bottom = true;
        }else if(row > 3){satForces.top = true
        }else{ satForces.top = true, satForces.bottom = true}

        if(satForces.right){
            if (satForces.top){ sats.push( ((row-1) *4) + column )}
            if (satForces.bottom){sats.push( (row * 4)  + column )}
        }
        if(satForces.left){
            if(satForces.top){ sats.push( (row-1)*4 + (column-1) ) }
            if(satForces.bottom){ sats.push( row*4 + (column-1) ) }
        }
        
        return sats; // array of the nodes that will affect the probe
    }
    var layoutPlayer = function layoutPlayer(playerNumber){ // p1 or p2
        return state.playerPos[playerNumber]
    }
    var layoutFireButton = function layoutFireButton(player){
        return {x: Ux*60 ,y: Uy*20 }
    }
    var layoutMessage = function layoutMessage(){
        return {    position: {x: Ux*200, y:Uy*300 },
                    size: {width: Ux*(400-10), height: Uy*(600-10) }
        }
    }

    return Object.assign(
        {gridPositions: gridPositions,
        activeSatellites:activeSatellites,
        getFieldSize:getFieldSize,
        inBounds: inBounds,
        layoutPlayer: layoutPlayer,
        layoutFireButton: layoutFireButton,
        layoutMessage: layoutMessage
        },
        behaviours.stateReporter(state)
    )
}

module.exports = GameArea
},{"./../behaviours.js":2}],7:[function(require,module,exports){
var behaviours = require('./../behaviours.js')

const InfoPopUp = function InfoPopUp(arguments){
    var state = {
        visible: false,
        colour: "#ffffff",
        position: (arguments.position) ? arguments.position : {x:200,y:400},
        size: (arguments.size ) ? arguments.size : {width: 100, height: 200},
        message: "someText"
    }
    var init = function init(){
        
    }
    var drawMessage = function drawMessage(canvasContext, state){
        canvasContext.save();
        
        canvasContext.fillStyle = "#000000";
        canvasContext.translate(-state.size.width/2, -state.size.height/2);
        canvasContext.fillText(state.message, 0 , 0)
        canvasContext.restore();
    }
    var clickFunction = function clickFunction(state, clickArgs){
        state.visible = false;
    }
    var getVisible = function getVisible(){
        return state.visible
    }
    var setMessage = function setMessage(newMessage){
        state.message = newMessage;
    }
    return Object.assign(
        {getVisible: getVisible,
        setMessage: setMessage},
        behaviours.renderable(state, [drawMessage]),
        behaviours.reactToClick(state, clickFunction)
    )
}

module.exports = InfoPopUp
},{"./../behaviours.js":2}],8:[function(require,module,exports){
var behaviours = require('./../behaviours.js');

const Probe = function Probe(position){
    const defaultSpeed = 100;
    const defaultLifetime = 9; // flight time in seconds
    var state = {
        visible: true,
        colour: '#ff69b4',
        position: { x:undefined , y:undefined },
        size: {width: 10, height:10},
        active: false,
        speed:{x:0, y:defaultSpeed},
        exipred: false,
        lifetime: defaultLifetime 
    }
    var init = function init(position){
        state.position.x = position.x;
        state.position.y = position.y
    }(position)

    var update = function update(timeDelta){
        state.lifetime -= timeDelta;
    }
    var reset = function reset(arguments){
        state.position = (arguments == undefined) ? {x:200, y:20} : arguments.position;
        state.speed = {x:0,y:defaultSpeed};
        state.active = false;
        state.expired = false;
        state.lifetime = defaultLifetime;
    }
    var trigger = function trigger(givenState, triggerArgs){
        if (triggerArgs.launchAngle) { state.speed = resolveLaunchAngle(triggerArgs.launchAngle) }
        givenState.active = true;
    }
    var getPos= function getPos(){
        return state.position;
    }
    var setPosition = function setPosition(newPosition){
        state.position = newPosition;
    }
    var applyForce = function applyForce(forceVector){
        state.speed.x += Math.max(-100, Math.min( forceVector.x, 100));
        state.speed.y += Math.max(-100, Math.min( forceVector.y, 100))
    }
    var toggleActive = function toggleActive(isActive){
        (isActive == undefined) ? state.active = !state.active : state.active = isActive;
    }
    var resolveLaunchAngle = function resolveLaunchAngle(angle){
        // angle from vertical
        return {    x: defaultSpeed * Math.sin(angle * ( (Math.PI)/180) ),
                    y: -defaultSpeed * Math.cos(angle * ( (Math.PI)/180) )
        }
    }
    var expire = function(){
        state.expired = true;
        state.active = false;
    }
    var isExpired = function (){
        return state.expired;
    }
    return Object.assign(
        { update:update,
        reset: reset,
        trigger:trigger,
        getPos:getPos,
        applyForce: applyForce,
        toggleActive:toggleActive,
        setPosition: setPosition,
        expire: expire,
        isExpired: isExpired},
        behaviours.renderable(state),
        behaviours.stateReporter(state),
        behaviours.mover(state)
    )
}

module.exports = Probe
},{"./../behaviours.js":2}],9:[function(require,module,exports){
var behaviours = require('../behaviours.js')

const Satellite = function Satellite(arguments){ 
    const gravity = 5;
    var state = {
        visible: true,
        colour: "#adff00",
        position: (arguments === undefined)? {x:20, y:20}: arguments.position,
        rotation:0, // in degrees
        size: (arguments === undefined)? {width:20, height:20}: arguments.size,
        loot: [0, 0],
        activePlayer: 0
    }
    var update = function update(arguments){ // phase: , click

    }
    var reset = function reset(){
        state.loot[0] = 0;
        state.loot[1] = 0;
        state.activePlayer = 0;
    }
    var clickFunction = function clickFunction(state, arguments){
        switch(arguments.phase){
            case 0:
                state.loot[state.activePlayer] += 1;
                break
            case 2:
                //state.colour = "#00ff00"
                break
        }
        
    }
    var renderScore = function renderScore(canvasContext, state){
        canvasContext.save();
        
        canvasContext.fillStyle = "#000000";
        canvasContext.translate(-4, -7);
        canvasContext.fillText(state.loot[state.activePlayer], 0 , 0)
        canvasContext.restore();
    }
    var setActive = function setActive(isActive){
        if(isActive){ state.colour = "#ff69b4" } else { state.colour = "#adff00" }
    }
    var exertForce = function extertForce(targetPosition){
        var distance_X= state.position.x - targetPosition.x;
        var distance_Y= state.position.y - targetPosition.y;
        var hypDistance = Math.sqrt( Math.pow(distance_X,2) + Math.pow(distance_Y, 2) );

        // force applied = Grav * (mass) / d^2
        var totalForce = (totalLoot() * gravity) / hypDistance ;

        return {x: (distance_X) ? totalForce * (distance_X/hypDistance) : 0,
                y: (distance_Y) ? totalForce * (distance_Y/hypDistance) : 0
            }
    }
    var totalLoot = function totalLoot(){
        return state.loot[0] + state.loot[1];
    }
    var stealLoot = function stealLoot(player){
        var lootStolen = state.loot[player];
        state.loot[player] = 0;
        return lootStolen;
    }
    var nextRound = function nextRound(){
        state.activePlayer = 1-state.activePlayer;
    }
    var getPlayerLoot = function getPlayerLoot(playerIndex){
        return state.loot[playerIndex]
    }
    return Object.assign(
        {setActive: setActive,
        exertForce: exertForce,
        nextRound: nextRound,
        update: update,
        reset:reset,
        stealLoot: stealLoot,
        getPlayerLoot: getPlayerLoot}, // start Object
        behaviours.renderable(state, [renderScore]), // behaviours
        behaviours.reactToClick(state, clickFunction),
        behaviours.stateReporter(state)
    )
}


module.exports = Satellite
},{"../behaviours.js":2}],10:[function(require,module,exports){
var behaviours = require('./../behaviours.js');

const Ship = function Ship(arguments){
    var state = {
        colour: "#FFFFFF",
        visible: true,
        position: (arguments.position) ? arguments.position : {x:10, y:10},
        rotation: (arguments.rotation) ? arguments.position : 0, // in degrees
        size:(arguments.size) ? arguments.size : {width:20,height:40},//(arguments===undefined)?{width:20,height:40}: arguments.position

    }
    var update = function update(){

    }
    var reset = function reset(){
        state.rotation = 0;
    }
    var getAngle = function getAngle(){ return state.rotation}
    var getPos = function getPos(){return state.position}
    return Object.assign(
        { update:update,
        reset:reset,
        getAngle: getAngle,
        getPos: getPos},
        behaviours.renderable(state),
        behaviours.turnToClick(state),
        behaviours.stateReporter(state)
    )
}

module.exports = Ship;
},{"./../behaviours.js":2}],11:[function(require,module,exports){
// bundle together all of the objects (working on individual files is easier)
var ClickMarker = require('./ClickMarker.js')
var FireButton = require('./FireButton.js');
var GameArea = require('./GameArea.js')
var InfoPopUp = require('./InfoPopUp.js')
var Probe = require('./Probe.js')
var Satellite = require('./Satellite.js')
var Ship = require('./Ship.js')

module.exports = {
    ClickMarker: ClickMarker,
    FireButton: FireButton,
    GameArea: GameArea,
    InfoPopUp: InfoPopUp,
    Probe: Probe,
    Satellite: Satellite,
    Ship: Ship 
}
},{"./ClickMarker.js":4,"./FireButton.js":5,"./GameArea.js":6,"./InfoPopUp.js":7,"./Probe.js":8,"./Satellite.js":9,"./Ship.js":10}],12:[function(require,module,exports){
var appManager = require('./AppManager.js');

init = function init(){
    appManager.init()
}
// -- launch order
// App Manager -- initiates the other states - holds the flow
    // Menu Manager-- draws the menu and holds the logic
    // Tutorial Manager -- draws the tutotial and holds the logic
    // Game Manager -- draws the game flow and holds the logic




},{"./AppManager.js":1}],13:[function(require,module,exports){
gObjs = require('./../gameObjects/objectBundle.js');

const GameModule = function GameModule(dimUnits){
    const endGameLimits = {
        pointLead:{
            gap: 10
        },
        pointRush:{
            goal: 25
        },
        roundRush:{
            rounds: 10
        },
        hoarder: {
            satCount: 3,
            satLimit: 15
        }
    }

    var state = {
        // game state trackers
        activePlayer: 0,
        turnPhase:0,
        turns: 0,
        // game objects to manipulate
        satellites: [],
        players: [],
        probe: undefined,
        messageBox: undefined,
        fireButton: undefined,
        gameArea: undefined,
        // round end flags
        satellitesToAdd: 10,
        phaseComplete: false,
        satelliteStolen: undefined,
        scores: [0,0],
        // endGame flags
        gameOver: false,
        gameMode: "point lead"

    }

    // ! CALL INIT IMMEDIATELY
    var init = function init(dimUnits){

        // create the game area
        state.gameArea = gObjs.GameArea(dimUnits.width, dimUnits.height);

        // create the players
        state.players.push( gObjs.Ship({position: state.gameArea.layoutPlayer('p1')}))
        state.players.push( gObjs.Ship({position: state.gameArea.layoutPlayer('p2')}))

        // get the positionss on the satellites
        var satPositions = state.gameArea.gridPositions();
        // create the satellites
        for (var i = 0; i < satPositions.length ; i++){
            state.satellites.push( gObjs.Satellite({
                position: satPositions[i],
                size:{height:20, width:20}
            }));
        }

        // create the probe
        state.probe = gObjs.Probe(state.gameArea.layoutPlayer('p1'))
        // create the fireButton
        state.fireButton = gObjs.FireButton(state.gameArea.layoutFireButton('p1'), state.probe)

        // create the message PopUp
        state.messageBox = gObjs.InfoPopUp(state.gameArea.layoutMessage())

    }(dimUnits)

    var render = function render(ctx){

        // clear the background
        // clear everything
        ctx.save()
        ctx.fillStyle = "#000000";
        ctx.fillRect(0,0,dimUnits.width*400, dimUnits.height*600);
        ctx.restore()

        // draw satellites
        state.satellites.forEach(function(sat){
            sat.draw(ctx);
        })

        // draw satellites
        state.players.forEach(function(ship){
            ship.draw(ctx);
        })

        // draw probe
        state.probe.draw(ctx);

        state.fireButton.draw(ctx)
        state.messageBox.draw(ctx)

        drawScores(ctx)

    }
    var reset = function reset(mode){
        switch(mode){
            case "point_rush":
                state.satellites.forEach(function(sat){sat.reset()});
                state.players.forEach(function(player){player.reset()})
                // game state trackers
                state.activePlayer = 0;
                state.turnPhase = 0
                state.satellitesToAdd = 10;
                state.phaseComplete = false;
                state.satelliteStolen = undefined;
                state.scores = [0,0];
                state.fireButton.reset();
                state.gameOver = false;
            break
        }
    }
    var update = function update(timeStep, keysDown){

        // == HANDLE INPUTS

        // Message window inputs
        if(state.messageBox.getVisible() && keysDown["click"]){
            var clickPos = {    x: keysDown["click"].offsetX,
                                y: keysDown["click"].offsetY}
            state.messageBox.runClick(clickPos);

            // check to see if the game needs resetting
            if( gameEnded() ){
                endAccepted()
            }
            return;
        }

        // Phase relevant input checks
        switch(getPhase()){
            case 0: // setting score on satellites
                // on a click
                if(keysDown["click"]){

                    var clickPos = {    x: keysDown["click"].offsetX,
                                        y: keysDown["click"].offsetY}

                    // check if a satellite was clicked
                    state.satellites.forEach( function(sat){    
                        if( sat.runClick(clickPos, {phase: getPhase()} ) ){
                            delete keysDown["click"];  // if it was remove the click as it is dealt with 
                            satAdded();
                        }
                    });

                }
                break;
            case 1: // aiming and firing the probe

                // on a click
                if(keysDown["click"]){

                    var clickPos = {    x: keysDown["click"].offsetX,
                                        y: keysDown["click"].offsetY}

                    // see if we are firing the probe - don't to anything else if it is
                    if(state.fireButton.runClick( clickPos , {launchAngle:state.players[state.activePlayer].getAngle()})){
                        delete keysDown["click"]; 
                        return
                    }

                }

                    // rotate the ship
                if( keysDown["click"] && keysDown["move"] ){ // if there is a click
                    var movePos = {    x: keysDown["move"].offsetX,
                                        y: keysDown["move"].offsetY
                    }
                    state.players[state.activePlayer].rotateToFace(movePos);
                }

                // probe movement && force update
                if(state.probe.isActive()){

                    var probePos = state.probe.getPos()
                    var appliedForce = {x:0, y:0};

                    // force update
                    activeSats = state.gameArea.activeSatellites(probePos); // decide which are active
                    
                    state.satellites.forEach(function(sat){ // reset everything to not active
                        sat.setActive(false)
                    });

                    activeSats.forEach(function(satIndex){      // make the right ones active
                        state.satellites[satIndex].setActive(true);
                        var thisForce =  state.satellites[satIndex].exertForce(probePos);
                        appliedForce.x += thisForce.x;
                        appliedForce.y += thisForce.y;
                    });

                    state.probe.applyForce(appliedForce);
                    state.probe.update(timeStep);

                    // move if in bounds
                    if(state.gameArea.inBounds(probePos)){state.probe.move(timeStep)}else{state.probe.expire()};
                }
                break;
            case 2: // choosing a satellite
                if(keysDown["click"]){

                    var clickPos = {    x: keysDown["click"].offsetX,
                                        y: keysDown["click"].offsetY}

                    // check if a satellite was clicked
                    state.satellites.forEach( function(sat, index){    
                        if( sat.runClick(clickPos, {phase: getPhase()} ) ){
                            setSatelliteStolen(index);
                            delete keysDown["click"];  // if it was remove the click as it is dealt with 
                        }
                    });

                }
                
                break

        }

        // Check if the phase / game is over
        switch (state.turnPhase){ /// CHECK IF THE PHASE IS OVER
            case 0:
                if(state.satellitesToAdd <= 0){ state.phaseComplete = true } // if enough loot handed out - go to next phase
                break
            case 1:
                if( state.probe.isExpired()){ state.phaseComplete = true; }
                break
            case 2:
                if( state.satelliteStolen != undefined){ state.phaseComplete = true}
            break 
        }
        
        if(state.phaseComplete){ nextPhase() }
        
    }
    var getActivePlayer = function getActivePlayer(){
        return state.activePlayer
    }
    var getPhase = function getPhase(){
        return state.turnPhase
    }
    var nextPhase = function nextPhase(){
        state.phaseComplete = false;
        switch(state.turnPhase){
            case 0:
                state.satellitesToAdd = 10;
                state.turnPhase = 1
                break;
            case 1:
                newProbePos = state.players[1-state.activePlayer].getPos()
                state.probe.reset({position: {    x: newProbePos.x,
                                            y: newProbePos.y
                }})
                state.turnPhase = 2
                break;
            case 2:
                
                // empty the oppositions loot from the satellite
                // give it to the player
                var stolenPoints = state.satellites[state.satelliteStolen].stealLoot(1-state.activePlayer)
                state.scores[state.activePlayer] += stolenPoints;

                
                if(state.activePlayer == 1){ // check if the game is ended if both players have had a go
                    state.turns ++; // advance the number of turns
                    var endState = endGame()

                    if(endState.end){ // if the end goal achieved
                        // set the message to the
                        state.messageBox.setMessage((endState.winner) + " WINS!"); // put instructions for the players
                        state.messageBox.toggleShow(true)   // show the message on screen
                        state.gameOver = true;
                    }
                    else{// go to next round

                        state.messageBox.setMessage(" Plunder stolen: " + stolenPoints + ". Next Players Turn"); // put instructions for the players
                        state.messageBox.toggleShow(true)   // show the message on screen
                        state.activePlayer = 1-state.activePlayer; // shift to the next player

                        //reset the flags for phase/round end
                        state.satelliteStolen = undefined;
                        state.satellites.forEach(function(sat){
                            sat.nextRound(); //TODO: change the active player on the satellites
                        })

                        // change the fire button posiion
                        state.fireButton.setPos({x:60, y:20+(state.activePlayer*560)})
                        state.turnPhase = 0
                        break;
                    }
                }else{  // TODO : clean this up so that it isn't duplicated in the endGame() check above
                    state.messageBox.setMessage(" Plunder stolen: " + stolenPoints + ". Next Players Turn"); // put instructions for the players
                    state.messageBox.toggleShow(true)   // show the message on screen
                    state.activePlayer = 1-state.activePlayer; // shift to the next player

                    //reset the flags for phase/round end
                    state.satelliteStolen = undefined;
                    state.satellites.forEach(function(sat){
                        sat.nextRound(); //TODO: change the active player on the satellites
                    })

                    // change the fire button posiion
                    state.fireButton.setPos({x:60, y:20+(state.activePlayer*560)})
                    state.turnPhase = 0
                    break;
                } 
        }
        
    }
    var satAdded = function satAdded(){
        state.satellitesToAdd --;
    }
    var setSatelliteStolen = function setSatelliteStolen(satelliteIndex){
        state.satelliteStolen = satelliteIndex;
    }
    var endGame = function endGame(){

        // point rush endgame - difference larger than 10 points
        switch(state.gameMode){
            case "point lead":  // get 10 points ahead of the opponent
                var scoreDiff = state.scores[0]-state.scores[1];

                if(Math.abs(scoreDiff) >= endGameLimits.pointLead.gap){
                    var winner;
                    if(scoreDiff > 0){winner = "p1"
                    }else{ winner = "p2" }
                    return {end:true, winner: winner}
                }

                return {end:false, winner:undefined}

            case "point rush":  // get to 30 points
                var p1Score = state.scores[0];
                var p2Score = state.scores[1];

                if(p1Score >= 30 || p2Score >= endGameLimits.pointRush.goal ){ // if someone over 30
                    if(p1Score != p2Score){ // keep going if we have a draw
                        return {end: true, winner: (p1Score > p2Score) ? "p1" : "p2"}
                    }
                }

                return {end: false, winner: undefined} // game not ended
            case "round rush":
                if (state.turns > endGameLimits.roundRush.rounds){  // if we have gone 10 rounds
                    var p1Score = state.scores[0];
                    var p2Score = state.scores[1];
                    if(p1Score != p2Score){ // make sure we don't have a draw
                        return {end: true, winner: (p1Score > p2Score) ? "p1" : "p2"}
                    }
                }
                return {end: false, winner: undefined}  // game not ended
            case "hoarder":
                
                // get array of tresaure on satellites
                var passSats = satLootGreaterThanX(endGameLimits.hoarder.satLimit);

                if(passSats.p1 >= endGameLimits.hoarder.satCount || passSats.p2 >= endGameLimits.hoarder.satCount){ // check that we have 3 passes
                    if(passSats.p1 != passSats.p2){ // check that we don't have the same amount of passes
                        return {end: true, winner: (passSats.p1 > passSats.p2) ? 'p1' : 'p2'}
                    }
                }

                return {end: false, winner: undefined}  // game not ended
        }
        
    }
    var drawScores = function drawScores(canvasCtx){

        canvasCtx.save();
        canvasCtx.fillStyle = "#FFFFFF";
        canvasCtx.translate(350, 20);
        canvasCtx.fillText("Score: "+ state.scores[0], 0 , 0)
        canvasCtx.restore()

        canvasCtx.save();
        canvasCtx.fillStyle = "#FFFFFF";
        canvasCtx.translate(350, 580 );
        canvasCtx.fillText("Score: "+ state.scores[1], 0 , 0)
        canvasCtx.restore()

    }
    var endAccepted = function endAccepted(){
        if(state.gameOver){
            reset("point_rush")  // reset the entire game
        }
    }
    var gameEnded = function gameEnded(){
        return state.gameOver;
    }
    var setGameMode = function setGameMode(){
        var modes = ["point lead", "point rush", "round rush", "hoarder"];

        var newModeIndex = modes.indexOf(state.gameMode) + 1;
        state.gameMode = (newModeIndex >= modes.length) ? modes[0] : modes[newModeIndex]
        
        return state.gameMode
    }
    var drawGameMode = function drawGameMode(canvasCtx){
        // print what game mode it is
        canvasCtx.save();
        canvasCtx.fillStyle = "#FFFFFF";
        canvasCtx.translate(95, 20);
        canvasCtx.fillText("Mode: "+ state.gameMode.toUpperCase(), 0 , 0)
        canvasCtx.restore()

        // mode specific indicators
        // - round indicator
        if(state.gameMode == "round rush"){
            canvasCtx.save();
            canvasCtx.fillStyle = "#FFFFFF";
            canvasCtx.translate(95, 30);
            canvasCtx.fillText("Round: "+ state.turns + " of " + endGameLimits.roundRush.rounds, 0 , 0)
            canvasCtx.restore()
        }else if(state.gameMode == "hoarder"){

            var qualifyingSats = satLootGreaterThanX(15);

            canvasCtx.save();
            canvasCtx.fillStyle = "#FFFFFF";
            canvasCtx.translate(95, 30);
            canvasCtx.fillText("Have "+ endGameLimits.hoarder.satCount+ " satellites", 0 , 0)
            canvasCtx.fillText("over " + endGameLimits.hoarder.satLimit, 0 , 10)

            canvasCtx.translate(120, -10);
            canvasCtx.fillText("Qualifying Satellites:", 0 , 0)
            canvasCtx.fillText("Player 1: " + qualifyingSats.p1, 0 , 10)
            canvasCtx.fillText("Player 2: " + qualifyingSats.p2, 0 , 20)
            canvasCtx.restore()
        }else if(state.gameMode == "point lead"){

            var qualifyingSats = satLootGreaterThanX(endGameLimits.pointLead.gap);

            canvasCtx.save();
            canvasCtx.fillStyle = "#FFFFFF";
            canvasCtx.translate(95, 30);
            canvasCtx.fillText("Be 10 points ahead", 0 , 0)
            canvasCtx.restore()
        }
        else if(state.gameMode == "point rush"){

            var qualifyingSats = satLootGreaterThanX(15);

            canvasCtx.save();
            canvasCtx.fillStyle = "#FFFFFF";
            canvasCtx.translate(95, 30);
            canvasCtx.fillText("First to "+endGameLimits.pointRush.goal+" points", 0 , 0)
            canvasCtx.restore()
        }

        // - qualifying satellites

    }
    var getSatelliteTreasure = function getSatelliteTreasure(){
        var p1Loot = [];
        var p2Loot = []
        state.satellites.forEach(function(satellite){
            p1Loot.push(satellite.getPlayerLoot(0))
        })
        state.satellites.forEach(function(satellite){
            p2Loot.push(satellite.getPlayerLoot(1))
        })
        return {p1: p1Loot, p2: p2Loot}
    }
    var satLootGreaterThanX = function satLootGreaterThanX(lootLimit){
        var satelliteLoot = getSatelliteTreasure();
        var hitLimit = function hitLimit(score){ return score >= lootLimit}

        var p1Pass = satelliteLoot.p1.filter(hitLimit)
        var p2Pass = satelliteLoot.p2.filter(hitLimit)
        
        return {p1: p1Pass.length, p2: p2Pass.length}
    }
    return Object.assign(
        { init: init,
        update:update,
        render: render,
        reset:reset,
        nextPhase:nextPhase,
        getPhase: getPhase,
        getActivePlayer:getActivePlayer,
        satAdded: satAdded,
        setSatelliteStolen: setSatelliteStolen,
        drawScores: drawScores,
        gameEnded : gameEnded,
        endAccepted: endAccepted,
        setGameMode: setGameMode,
        drawGameMode: drawGameMode},
        behaviours.stateReporter(state)
    )
}

module.exports = GameModule
},{"./../gameObjects/objectBundle.js":11}],14:[function(require,module,exports){
Button = require('./../gameObjects/Button.js')
FireButton = require('./../gameObjects/FireButton.js')

const MenuModule = function MenuModule(dimUnits){
    var state = {
        objects : []
    }

    const init = function init(dimUnits){
    
        var button = Button({
            pos: {x:dimUnits.width*50, y:dimUnits.height*50},//x: dimUnits.width*50, y: dimUnits.height*20},
            size: {width:dimUnits.width*20, height:dimUnits.height*20},//width: dimUnits.width*10, height:dimUnits*2.5},
            clickFunction: function(){console.log("Been Clicked")}
        })

        state.objects.push(button)
    }(dimUnits)

    const update = function update(timeStep, keysPressed){
        
    }

    const render = function render(ctx){

        // clear everything
        ctx.save()
        ctx.fillStyle = "#000000";
        ctx.fillRect(0,0,dimUnits.width*400, dimUnits.height*600);
        ctx.restore()

        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.translate(dimUnits.width*50, dimUnits.height*50)
        ctx.fillText("SOME MENU ITEM", 0,0)
        ctx.restore()

        state.objects.forEach((obj)=>{if(obj.draw){obj.draw(ctx)}})
    }

    return Object.assign(
        {   init: init,
            update: update,
            render: render
        }
    )
}

module.exports = MenuModule
},{"./../gameObjects/Button.js":3,"./../gameObjects/FireButton.js":5}]},{},[12]);
