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