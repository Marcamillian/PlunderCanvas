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

module.exports = InfoPopUp