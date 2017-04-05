
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
        size: (arguments === undefined)? {width:20, height:20}: arguments.size
    },
    getState = function getState(){
        return state;
    },
    clickFunction = function clickFunction(state){
        state.colour = "#ff0000"
    },
    additionalRender = function additionalRender(canvasContext){
        
    }
    return Object.assign(
        {getState:getState}, // start Object
        renderable(state, [additionalRender]), // behaviours
        reactToClick(state, clickFunction)
    )
}

// SHIP OBJECT
const Ship = function Ship(arguments){
    state = {
        colour: "#FFFFFF",
        position: (arguments === undefined)? {x:10, y:10}: arguments.position,
        rotation:15, // in degrees
        size:{width:20,height:40}//(arguments===undefined)?{width:20,height:40}: arguments.position
    },
    getState = function getState(){ return state}
    return Object.assign(
        {getState:getState},
        renderable(state),
        turnToClick(state)
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
        renderable(state),
        moveToClick(state)
    )
}
