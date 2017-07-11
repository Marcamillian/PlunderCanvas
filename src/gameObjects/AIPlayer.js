behaviours = require('./../behaviours.js')

const AIOpposition = function AIOpposition(){
    const adjDirections = ["above", "below", "left", "right"]
    
    var state = {
        satelliteSuspicion :[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        probeFired: false,
        clickPoint: {x:150, y:236},
        satellitesPlaced: 10,
        lastProbePos: {x:0, y:0},
        lastProbeVector: {x:0, y:0},
        changeVector: {x:0, y:0}
    }
    // API INTERFACES
    var update = function update(arguments){
        var myLoot = gameController.getLootArray(gameController.getActivePlayer()); // get what your loot looks like

        switch(arguments.roundPhase){
            case 0: // place satellites randomly
                    // TODO : Feeling cocky or not
                    // TODO : weight probability towards/away from certain satellites
                // place loot in a safe space? - where there isn't too much loot
                var randomSat = Math.floor(Math.random()*15.99)// select a satellite to place something on at random
                while (myLoot[randomSat] > 10){randomSat = Math.floor(Math.random()*15.99)} // loop back round if there are too many on the satellite

                state.clickPoint = satellites[randomSat].getPosition() // set the position
            break
            case 1: // place & fire phase update

                if(!arguments.probeFired){ // if not fired yet
                    // randomly guess at a position - between two adjacent satellites
                    var randomSat = Math.floor(Math.random()*15.99)// select a satellite to place something on at random
                    var adjDirection = adjDirections[Math.floor(Math.random()*4)]
                    var adjacentSat = gameArea.adjacentSat(randomSat, adjDirection)
                    state.clickPoint = satellites[randomSat].getPosition()

                    // set up the current probe position as the first difference // TODO: Could we get the starting vector??
                    //state.lastProbePos = arguments.probePos;

                    console.log("pointing")
                }else{ // if fired
                    // the slope difference that is found - +ve if left -- -ve if right

                    var probe_XChange = arguments.probePos.x - state.lastProbePos.x ;
                    var probe_YChange = arguments.probePos.y - state.lastProbePos.y;

                    var thisProbePos = arguments.probePos;
                    var observedUnitVector = VectorTools.toUnitVector(probe_XChange, probe_YChange);

                    // find the difference in the vectors
                    var changeVector = VectorTools.toUnitVector( observedUnitVector.x - state.lastProbeVector.x,
                                                                    observedUnitVector.y - state.lastProbeVector.y)

                    // store the data for the next update
                    state.lastProbePos.x = arguments.probePos.x;
                    state.lastProbePos.y = arguments.probePos.y;
                    state.lastProbeVector = observedUnitVector;
                    state.changeVector = changeVector;
                    
                }

                // what probes I want to find out more about (ones that I am most suspicious of?)
                    // how much the probe position changed from last time
                    // if probe didnt change acceloration much - make other places suspicious
            break
            case 2:
                // pick somewhere to steal the one that I am most suspicious of
                    // compare 

                state.lastProbePos = {x:0, y:0}
                state.lastProbeVector = {x:0, y:0}
            break
        }
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
    var getClickPos = function getClickPos(gamePhase){
        return state.clickPoint;
    }
    var isConfident = function isConfident(scores){

    }
    var drawSuspicion = function DrawSuspicion(ctx, probePosition){
        
        ctx.save();
        ctx.strokeStyle = 'deeppink';

        ctx.beginPath();
        ctx.moveTo(probePosition.x, probePosition.y);
        ctx.lineTo( probePosition.x + state.lastProbeVector.x * 50,
                        probePosition.y + state.lastProbeVector.y * 50);
        ctx.stroke();

        ctx.beginPath()
        ctx.moveTo(probePosition.x, probePosition.y)
        ctx.strokeStyle = "yellow";
        ctx.lineTo( probePosition.x + state.changeVector.x * 50,
                        probePosition.y + state.changeVector.y * 50)
        ctx.stroke();
        

        ctx.restore()
    }
    return Object.assign(
        {getClickPos: getClickPos,
        update:update,
        drawSuspicion: drawSuspicion
        },
        behaviours.stateReporter(state)
    )
}

module.exports = AIOpposition