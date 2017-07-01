// import the modules
var menuModule = require('./modules/MenuModule.js');

// app wide variables
var viewPort;
var viewPortDims = {
    height: 600,
    width: 400
}
viewPortDimUnits = {    // standardised to the ratio
    height: viewPortDims.height/600,
    width: viewPortDims.width/400
}
var keysDown = {};  // track the keys pressed
var then;   // track the last frame time

var init = function init(){
    // create the viewport
    var canvas = document.createElement("canvas");
    viewPort = canvas.getContext("2d");
    canvas.width = viewPortDims.width
    canvas.height = viewPortDims.height
    document.body.appendChild(canvas)

    menuModule.init(viewPortDimUnits)

    // configure the modules 
        // GameModule -
            // create the gameArea
            // set up players
            // get postions of the satellites
            // set up satellites
            // set up the message window -- make this part of the menu?
            // pass all of these to the gameController

    // kick off the mainLoop
    then = Date.now();
    mainLoop();
}

var mainLoop = function mainLoop(){
    var now = Date.now();
    var delta = now - then;

    update(delta/1000);
    render(viewPort);

    then = now

    requestAnimationFrame(mainLoop)
}

var update = function update(){
   // update the appropriate module
    // menu
    // tutorial
    // game

}

var render = function render(){

    menuModule.render(viewPort, {width:viewPortDims.width/100, height:viewPortDims.height/100 })
    // render the appropriate module
    // menu
    // tutorial
    // game
}

var setUpControls = function setUpControls(){

    // listen for keyDown
    addEventListener("keyDown", function(e){
        keysDown[e.keyCode] = true
    }, false);

    // listen for keyUp
    addEventListener("keyup", function(e){
            delete keysDown[e.keyCode];
    }, false);

}


module.exports = {
    init: init,
    mainLoop: mainLoop
}