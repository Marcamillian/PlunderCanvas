behaviours = require('./../behaviours.js')

const MessageBox = function MessageBox(
    position = {x:200, y:400},
    size = {width:200, height:100}
){
    state = {
        visible: true,
        color: "#ffffff",
        position:position,
        size: size,
        message: "placeholder text"
    }

    var init = function init(){

    }

    var drawMessage = function(canvasContext, state){
        canvasContext.save()

        canvasContext.fillStyle = "#000000";
        canvasContext.translate(-state.size.width/2, - state.size.height/2);
        canvasContext.fillText(state.message,0,0)
        canvasContext.restore()
    }

    // buttons to progress stage/message
    var setMessage = function setMessage(newMessage){
        state.message = newMessage;
    }

    var getMessage = function getMessage(){
        return state.message;
    }

    var getHeight = function getHeight(){
        return state.size.height;
    }

    var getWidth = function getWidth(){
        return state.size.width;
    }

    var getPosX = function getPosX(){
        return state.position.x
    }

    var getPosY = function getPosY(){
        return state.position.y
    }

    return Object.assign(
        {
            setMessage,
            getMessage,
            getHeight,
            getWidth,
            getPosY,
            getPosX
        },
        behaviours.renderable(state, [drawMessage]),
        behaviours.stateReporter(state)
    )
}

module.exports = MessageBox;