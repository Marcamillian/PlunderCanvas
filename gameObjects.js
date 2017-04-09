
var probe = {
    x:0,
    y:0
}.prototype = {
    speed:10
}

// SATELLITE OBJECT
const Satellite = function Satellite(arguments){ 
    state = {
        colour: "#adff00",
        position: (arguments === undefined)? {x:20, y:20}: arguments.position,
        rotation:0, // in degrees
        size: (arguments === undefined)? {width:20, height:20}: arguments.size,
        loot:{ player1:0, player2:0}
    },
    clickFunction = function clickFunction(state){
        state.loot.player1 += 1;
    },
    renderScore = function renderScore(canvasContext, state){
        canvasContext.save();
        
        canvasContext.fillStyle = "#000000";
        canvasContext.translate(-4, -7);
        canvasContext.fillText(state.loot.player1, 0 , 0)
        canvasContext.restore();
    }
    return Object.assign(
        {}, // start Object
        renderable(state, [renderScore]), // behaviours
        reactToClick(state, clickFunction),
        stateReporter(state)
    )
}

// SHIP OBJECT
const Ship = function Ship(arguments){
    state = {
        colour: "#FFFFFF",
        position: (arguments === undefined)? {x:10, y:10}: arguments.position,
        rotation:15, // in degrees
        size:{width:20,height:40}//(arguments===undefined)?{width:20,height:40}: arguments.position
    }
    return Object.assign(
        {},
        renderable(state),
        turnToClick(state),
        stateReporter(state)
    )
}

// OBJECT FOR WHERE YOU CLICK 
const ClickMarker = function ClickMarker(){
    state = {
        colour: '#ff69b4',
        position: { x:20, y:20},
        size: {width:10, height:10}
    }
    return Object.assign(
        {},
        renderable(state),
        moveToClick(state)
    )
}

const Probe = function Probe(){
    state = {
        colour: '#ff69b4',
        position: { x:20 , y:20 },
        size: {width: 10, height:10},
        active: false,
        speed:{x:0, y:25}
    },
    trigger = function trigger(givenState){ // TODO: state getting passed here doesnt have speed on
        givenState.active = true;
    }
    return Object.assign(
        {trigger:trigger},
        renderable(state),
        stateReporter(state),
        mover(state)
    )
}

const FireButton = function FireButton(targetObject){
    state = {
        colour: '#0000ff',
        position: {x:60, y:20},
        size: {width: 40, height:20}
    },
    clickFunction = function clickFunction(){
        targetObject.trigger(targetObject.getState()); // HACKY WAY ROUND THE CLOSURE
    }
    return Object.assign(
        {},
        renderable(state),
        reactToClick(state, clickFunction)
    )
}

const GameArea = function GameArea(canvasWidth, canvasHeight){
    state = {
        gutters: {top:50, side:0},
        satelliteSpacing: {x:undefined, y: undefined},
        satFieldSize: {width:canvasWidth, height:canvasHeight}
    },
    gridPositions = function gridPositions(){
        var spacing_X = spaceWidth / 4;
        var spacing_Y = spaceHeight / 4;
        var positions = [];

        // setup satellites
        for (var i = 0; i < 16 ; i++){  // rows
            positions.push({});
            positions[i].x = (spacing_X /2) + i%4 * (spacing_X);
            positions[i].y = (spacing_Y /2)+ Math.floor(i/4)*(spacing_Y);
        }

        return positions/*.map(function(position){
            position.x += gutters.side; // adding on the surrounding area
            position.y += gutters.top;
        });*/
    }
}
