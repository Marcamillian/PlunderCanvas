
var probe = {
    x:0,
    y:0
}.prototype = {
    speed:10
}

// SATELLITE OBJECT
const Satellite = function Satellite(arguments){ 
    var state = {
        colour: "#adff00",
        position: (arguments === undefined)? {x:20, y:20}: arguments.position,
        rotation:0, // in degrees
        size: (arguments === undefined)? {width:20, height:20}: arguments.size,
        loot:{ player1:0, player2:0}
    }
    var clickFunction = function clickFunction(state){
        state.loot.player1 += 1;
    }
    var renderScore = function renderScore(canvasContext, state){
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
    var state = {
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
    var state = {
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
    var state = {
        colour: '#ff69b4',
        position: { x:20 , y:20 },
        size: {width: 10, height:10},
        active: false,
        speed:{x:0, y:25}
    }
    var trigger = function trigger(givenState){
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
    var state = {
        colour: '#0000ff',
        position: {x:60, y:20},
        size: {width: 40, height:20}
    }
    var clickFunction = function clickFunction(){
        targetObject.trigger(targetObject.getState()); // HACKY WAY ROUND THE CLOSURE
    }
    return Object.assign(
        {},
        renderable(state),
        reactToClick(state, clickFunction)
    )
}

const GameArea = function GameArea(canvasWidth, canvasHeight){ // TODO:
    var state = {
        gutters: {top:50, side:0},
        satelliteSpacing: {x:0,y:0},
        satFieldSize: {width:canvasWidth, height:canvasHeight}
    }
    var gridPositions = function gridPositions(){
        
        var positions = [];
        state.satelliteSpacing.x = (state.satFieldSize.width - (2*state.gutters.side)) / 4;
        state.satelliteSpacing.y = (state.satFieldSize.height - (2*state.gutters.top)) / 4;
        
        
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
    return Object.assign(
        {gridPositions: gridPositions},
        stateReporter(state)
    )
}
