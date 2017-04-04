// game objects
var ship = {
    name:"playerOne",
    direction:0, // radia
    x:0,
    y:0,
}.prototype = {
    width:20,
    height:40
}

var satellite = {
    x:0,
    y:0,
    store:{playerOne:0, playerTwo:0}
}.prototype = {
    width:20,
    height:20
}

var probe = {
    x:0,
    y:0
}.prototype = {
    speed:10
}

// testing composed objects

const Satellite = function Satellite(arguments){ 
    state = {
        colour: "#adff00",
        position: (arguments === undefined)? {x:20, y:20}: arguments.position,
        size: (arguments === undefined)? {width:20, height:20}: arguments.size,
    },
    getState = function getState(){
        return state;
    }
    return Object.assign(
        {getState:getState}, // start Object
        renderable(state) // behaviours
    )
}

const Ship = function Ship(arguments){
    state = {
        colour: "#FFFFFF",
        position: (arguments === undefined)? {x:10, y:10}: arguments.position,
        size:{width:20,height:40}//(arguments===undefined)?{width:20,height:40}: arguments.position
    },
    getState = function getState(){ return state}
    return Object.assign(
        {getState:getState},
        renderable(state)
    )
}
