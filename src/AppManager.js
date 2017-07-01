// import the modules
var MenuModule = require('./modules/MenuModule.js');
var GameModule = require('./modules/GameModule.js');

// app wide variables
var viewPort;
var viewPortDims = {
    height: 600,
    width: 400
}
var viewPortDimUnits = {    // standardised to the ratio
    height: viewPortDims.height/600,
    width: viewPortDims.width/400
}

// input variables
var keysDown = {};  // track the keys pressed

// timing variables
var then;   // track the last frame time

// module instance
var gameModule = GameModule(viewPortDimUnits)
var menuModule = MenuModule(viewPortDimUnits)
// moduleManagement
var activeModule = menuModule;

var init = function init(){
    // create the viewport
    var canvas = document.createElement("canvas");
    viewPort = canvas.getContext("2d");
    canvas.width = viewPortDims.width
    canvas.height = viewPortDims.height
    document.body.appendChild(canvas)

    setUpControls(canvas)
        
    // configure the modules 
        // GameModule -


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

var update = function update(timeStep){

    // handle all of the AppManagers inputs first
    if(keysDown[77]){
        changeModules()
        delete keysDown[77]
    }

    // update the active module
    activeModule.update(timeStep, keysDown);    
    
   // update the appropriate module
    // menu
    // tutorial
    // game

}

var render = function render(){

    //menuModule.render(viewPort, {width:viewPortDims.width/100, height:viewPortDims.height/100 })
    activeModule.render(viewPort)
    
    // render the appropriate module
    // menu
    // tutorial
    // game
}

var setUpControls = function setUpControls(canvas){
    console.log("Here is the window: " , window)
    // listen for keyDown
    window.addEventListener("keydown", function(e){
        keysDown[e.keyCode] = true
    }, false);

    // listen for keyUp
    window.addEventListener("keyup", function(e){
            delete keysDown[e.keyCode];
    }, false);

    // add the event listeners for the mouse clicks
    canvas.addEventListener("mousedown", function(e){
        keysDown["click"] = e;
    })
    canvas.addEventListener("mouseup", function(e){
        delete keysDown["click"];
        delete keysDown["move"];
    })
    canvas.addEventListener("mousemove", function(e){
        keysDown["move"] = e;
    })

}

var changeModules = function changeModules(){
    return activeModule = (activeModule == menuModule) ? gameModule : menuModule
}
module.exports = {
    init: init,
    mainLoop: mainLoop
}