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

const Satellite = function Satellite(){
    state = {
        colour: "#adff00",
        position: {x:20, y:20},
        size:{width:10, height:10}
    },
    getState = function getState(){
        return state;
    }
    return Object.assign(
        {getState:getState}, // start Object
        renderable(state) // behaviours
    )
}


