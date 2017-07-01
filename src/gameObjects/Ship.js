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

module.exports = Ship;