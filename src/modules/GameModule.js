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

    // == Generic Function Calls

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
        state.messageBox.draw(ctx)

        drawScores(ctx)
        drawGameMode(ctx)
        drawPhaseUI(ctx)

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

    // == Module specific calls

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
    var drawPhaseUI = function drawPhaseUI(ctx){
        switch(state.turnPhase){
            case 0:
                ctx.save();
                ctx.fillStyle = "#FFFFFF";
                ctx.translate(250, 40);
                ctx.fillText("Treasure to place: "+ state.satellitesToAdd, 0 , 0)
                ctx.restore()
                break;
            case 1:
                ctx.save();
                ctx.fillStyle = "#FFFFFF";
                ctx.translate(250, 40);
                ctx.fillText("Aim and fire probe", 0 , 0)
                ctx.restore()
                state.fireButton.draw(ctx)
                break;
            case 2:
                ctx.save();
                ctx.fillStyle = "#FFFFFF";
                ctx.translate(250, 40);
                ctx.fillText("Steal treasure from opponent", 0 , 0)
                ctx.restore()
                break;
        }
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
        {
            update:update,
            render: render,
            reset:reset,
            toggleGameMode: setGameMode
        },
        behaviours.stateReporter(state)
    )
}

module.exports = GameModule