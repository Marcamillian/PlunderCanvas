
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
    return Object.assign(
        {setActive: setActive,
        exertForce: exertForce,
        nextRound: nextRound,
        update: update,
        reset:reset,
        stealLoot: stealLoot}, // start Object
        renderable(state, [renderScore]), // behaviours
        reactToClick(state, clickFunction),
        stateReporter(state)
    )
}

// SHIP OBJECT
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
        renderable(state),
        turnToClick(state),
        stateReporter(state)
    )
}

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
        renderable(state),
        moveToClick(state)
    )
}

const Probe = function Probe(){
    const defaultSpeed = 100;
    const defaultLifetime = 9; // flight time in seconds
    var state = {
        visible: true,
        colour: '#ff69b4',
        position: { x:200 , y:20 },
        size: {width: 10, height:10},
        active: false,
        speed:{x:0, y:defaultSpeed},
        exipred: false,
        lifetime: defaultLifetime 
    }
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
        renderable(state),
        stateReporter(state),
        mover(state)
    )
}

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
    var reset = function reset(){

    }
    var update = function update(){

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
        // game state trackers
        activePlayer: 0,
        turnPhase:0,
        aiPlayer: arguments.ai,
        // game objects to manipulate
        satellites: arguments.satellites,
        players: arguments.players,
        probe: arguments.probe,
        messageBox: arguments.messageBox,
        fireButton: fireButton,
        // round end flags
        satellitesToAdd: 10,
        phaseComplete: false,
        satelliteStolen: undefined,
        scores: [0,0],
        // endGame flags
        gameOver: false

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
    var update = function update(){
        switch (state.turnPhase){ /// CHECK IF THE PHASE IS OVER
            case 0:
                if(state.satellitesToAdd <= 0){ state.phaseComplete = true } // if enough loot handed out - go to next phase
                break
            case 1:
                if( probe.isExpired()){ state.phaseComplete = true; }
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
                probe.reset({position: {    x: newProbePos.x,
                                            y: newProbePos.y
                }})
                state.turnPhase = 2
                break;
            case 2:
                
                // empty the oppositions loot from the satellite
                // give it to the player
                var stolenPoints = state.satellites[state.satelliteStolen].stealLoot(1-state.activePlayer)
                state.scores[state.activePlayer] += stolenPoints;


                // check if the game is ended

                var endState = endGame()

                if(endState.end){ // if the end goal achieved
                    // set the message to the
                    state.messageBox.setMessage("Player " + (endState.winner+1) + " WINS!"); // put instructions for the players
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
        }
        
    }
    var satAdded = function satAdded(){
        state.satellitesToAdd --;
    }
    var setSatelliteStolen = function setSatelliteStolen(satelliteIndex){
        state.satelliteStolen = satelliteIndex;
    }
    var endGame = function endGame(){

        var scoreDiff = state.scores[0]-state.scores[1];

        if(Math.abs(scoreDiff) >= 10){
            var winner;
            if(scoreDiff > 0){winner = 0
            }else{ winner = 1 }
            return {end:true, winner:0}
        }
        return {end:false, winner:undefined}
        
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
    var isPlayerAI = function isPlayerAI(){
        return (state.aiPlayer && state.activePlayer == 1) ?  true : false;
    }
    return Object.assign(
        { update:update,
        reset:reset,
        nextPhase:nextPhase,
        getPhase: getPhase,
        getActivePlayer:getActivePlayer,
        satAdded: satAdded,
        setSatelliteStolen: setSatelliteStolen,
        drawScores: drawScores,
        gameEnded : gameEnded,
        endAccepted: endAccepted,
        isPlayerAI: isPlayerAI},
        stateReporter(state)
    )
}

const InfoPopUp = function InfoPopUp(arguments){
    var state = {
        visible: false,
        colour: "#ffffff",
        position: (arguments.position) ? arguments.position : {x:200,y:400},
        size: (arguments.size ) ? arguments.size : {width: 100, height: 200},
        message: "someText"
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
        renderable(state, [drawMessage]),
        reactToClick(state, clickFunction)
    )
}

// AI object to run the game
const AIOpposition = function AIOpposition(){
    var state = {
        satelliteSuspicion :[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    }
    // API INTERFACES
    var update = function update(currentPlunderArray){
        // phase 1
        // placeSatellite(currentPlunderArray)
    }
    var placeSatellite = function placeSatellite(currentPlunderArray){ // return the index of the satellite that I want
        // if confident
            // place loot concentrated in one place - no more than 10?
            // loop through array to se where stuff already is 
            // if even choose random (weighted towards the edge?)
        //if not
            // spread them around in ones or twos

            // For now
    }
    var getClickPos = function getClickPos(){
        return {x:150,y:236}
    }
    var isConfident = function isConfident(scores){

    }
    // phase 1 - place satellites 
        // what info it needs - where his stashes are
        // how cocky you are (score difference)
    // phase 2 - fire probe
        // what info - where his stashes are
        // where the player is suspicious of from previous
    // phase 3 - select a satellite to steal from
        // where you are suspicious of
    return Object.assign(
        {getClickPos: getClickPos
        },
        stateReporter(state)
    )
}
