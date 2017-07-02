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
            x: state.satFieldSize.width/4, // 16 based
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
        return (position.x > 5 && position.x < state.screenSize.width -5
                && position.y > 5 && position.y < state.screenSize.height - 5) ? true : false
    }
    var getFieldSize = function getFieldSize(){
        return state.satFieldSize;
    }
    var gridPositions = function gridPositions(){
        
        var positions = [];

        // setup satellites
        for (var i = 0; i < 16 ; i++){  // rows // 16 based
            positions.push({});
            positions[i].x = (state.satelliteSpacing.x /2) + i%4 * (state.satelliteSpacing.x); // 16 based
            positions[i].y = (state.satelliteSpacing.y /2)+ Math.floor(i/4)*(state.satelliteSpacing.y); // 16 based 
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

        if( row < 1 ){ satForces.bottom = true; // 16 based
        }else if(row > 3){satForces.top = true  // 16 based
        }else{ satForces.top = true, satForces.bottom = true}

        if(satForces.right){
            if (satForces.top){ sats.push( ((row-1) *4) + column )} // 16 based
            if (satForces.bottom){sats.push( (row * 4)  + column )} // 16 based
        }
        if(satForces.left){
            if(satForces.top){ sats.push( (row-1)*4 + (column-1) ) }    // 16 based
            if(satForces.bottom){ sats.push( row*4 + (column-1) ) }     // 16 based
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