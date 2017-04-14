
var probe = {
    x:0,
    y:0
}.prototype = {
    speed:10
}

// SATELLITE OBJECT
const Satellite = function Satellite(arguments){ 
    const gravity = 5;
    var state = {
        colour: "#adff00",
        position: (arguments === undefined)? {x:20, y:20}: arguments.position,
        rotation:0, // in degrees
        size: (arguments === undefined)? {width:20, height:20}: arguments.size,
        loot: [0, 0],
        activePlayer: 0
    }
    var clickFunction = function clickFunction(state, arguments){
        state.loot[state.activePlayer] += 1;
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
    var nextRound = function nextRound(){
        state.activePlayer = 1-state.activePlayer;
    }
    return Object.assign(
        {setActive: setActive,
        exertForce: exertForce,
        nextRound: nextRound}, // start Object
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
        rotation:0, // in degrees
        size:{width:20,height:40}//(arguments===undefined)?{width:20,height:40}: arguments.position
    }
    var getAngle = function getAngle(){ return state.rotation}
    var getPos = function getPos(){return state.position}
    return Object.assign(
        {getAngle: getAngle,
        getPos: getPos},
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
    const defaultSpeed = 100;
    var state = {
        colour: '#ff69b4',
        position: { x:200 , y:20 },
        size: {width: 10, height:10},
        active: false,
        speed:{x:0, y:defaultSpeed}
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
    var reset = function reset(){
        state.position = {x:200, y:20};
        state.speed = {x:0,y:defaultSpeed};
        state.active = false;
    }
    var applyForce = function applyForce(forceVector){
        state.speed.x += Math.max(-100, Math.min( forceVector.x, 100));
        state.speed.y += Math.max(-100, Math.min( forceVector.y, 100))
    }
    var toggleActive = function toggleActive(){
        state.active = !state.active
    }
    var resolveLaunchAngle = function resolveLaunchAngle(angle){
        // angle from vertical
        return {    x: defaultSpeed * Math.sin(angle * ( (Math.PI)/180) ),
                    y: -defaultSpeed * Math.cos(angle * ( (Math.PI)/180) )
        }
    }
    return Object.assign(
        {trigger:trigger,
        getPos:getPos,
        applyForce: applyForce,
        reset: reset,
        toggleActive:toggleActive,
        setPosition: setPosition},
        renderable(state),
        stateReporter(state),
        mover(state)
    )
}

const FireButton = function FireButton(targetObject, triggerArgs){
    var state = {
        colour: '#0000ff',
        position: {x:60, y:20},
        size: {width: 40, height:20}
    }
    var clickFunction = function clickFunction(state, clickArgs){
        targetObject.trigger(targetObject.getState(), clickArgs); // HACKY WAY ROUND THE CLOSURE
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
        satFieldSize: {width:canvasWidth, height:canvasHeight},
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
    var activeSatellites = function activeSatellites(position){

        var sats = []
        var satForces = {};
        var column = Math.floor( ( (position.x - state.gutters.side) / state.satelliteSpacing.x) -0.5) + 1 ;
        var row = Math.floor( ( (position.y - state.gutters.top) / state.satelliteSpacing.y) -0.5 ) + 1;
        //console.log( "click position   ", column,  " : ",row)
        
        //console.log("grid square: ", row*5 + column); // calculate the grid square the probe is in

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
    return Object.assign(
        {gridPositions: gridPositions,
        activeSatellites:activeSatellites,
        getFieldSize:getFieldSize,
        inBounds: inBounds},
        stateReporter(state)
    )
}

const GameController = function GameController(arguments){
    var state = {
        activePlayer: 0,
        turnPhase:0,
        satellites: arguments.satellites,
        players: arguments.players,
        probe: arguments.probe
    }
    var getActivePlayer = function getActivePlayer(){
        return state.activePlayer
    }
    var getPhase = function getPhase(){
        return state.turnPhase
    }
    var nextTurn = function nextTurn(){

        var newProbePosition;

        state.activePlayer = 1-state.activePlayer;
        state.turnPhase = 0;

        state.satellites.forEach(function(sat){
            sat.nextRound(); //TODO: change the active player on the satellites
        })

        newProbePos = state.players[state.activePlayer].getPos()

        state.probe.setPosition({x: newProbePos.x, y: newProbePos.y})

    }
    var nextPhase = function nextPhase(){
        if(state.turnPhase < 2){state.turnPhase += 1}else{
            nextTurn()
        }
        console.log("activePlayer: ", state.activePlayer, " || Phase: ",state.turnPhase )
    }
    return Object.assign(
        {nextPhase:nextPhase,
        getPhase: getPhase,
        getActivePlayer:getActivePlayer},
        stateReporter(state)
    )
}
