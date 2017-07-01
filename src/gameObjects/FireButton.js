var behaviours = require('./../behaviours.js');

const FireButton = function FireButton(position, targetObject, triggerArgs){
    var state = {
        visible: true,
        colour: '#0000ff',
        position: {x:60, y:20},
        size: {width: 40, height:20}
    }
    // !! INIT STRAIGHT AWAY
    var init = function init(position){
        state.position.x = position.x;
        state.position.y = position.y
    }(position)
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
        behaviours.renderable(state),
        behaviours.reactToClick(state, clickFunction)
    )
}

module.exports = FireButton;