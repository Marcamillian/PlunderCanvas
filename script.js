var canvas;
var ctx;
var width;
var height;

var then; // date() of previous frame 

var gameController = {};
var gameArea = {}; // object to contain the state of the play field and untility functions
var compPlayers = []; // array of players
var compSatellites = [];   // array of satellites
var clickMarker = {};   // object for tracking the previous click of the mouse
var probe = {}; // probe that is affected by gravity

// controls tracking
var keysDown = {};

addEventListener("keyDown", function(e){
    keysDown[e.keyCode] = true
}, false);

addEventListener("keyup", function(e){
    delete keysDown[e.keyCode];
}, false);

// == GAME FUNCTIONS == 

// initilisation
function init(){
    
    var satelliteSpacing_X;
    var satelliteSpacing_Y;
    var satPositions;
    var topGutter = 50;
    var sideGutter = 0;
    var satFieldWidth;
    var satFieldHeight;

    // create the canvas
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 600;
    document.body.appendChild(canvas);

    // event listeners for canvas element
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

    // create the gameArea object for controlling game area
    gameArea = GameArea(400, 600);

    // satellite field size
    satFieldWidth = canvas.width - 2*sideGutter;
    satFieldHeight = canvas.height - 2*topGutter;
    satelliteSpacing_X = satFieldWidth / 4;
    satelliteSpacing_Y = satFieldHeight / 4;
    
    // setup players
    compPlayers.push(Ship({ // player 1
        position:{ x: canvas.width/2, y: topGutter/2}
    }));
    compPlayers.push(Ship({ // player 2
        position:{x: canvas.width/2, y: canvas.height - topGutter/2}
    }))

    // ===  setup satellites === 

    // get positions
    satPositions = gameArea.gridPositions();

    // make the satellites
    for (var i = 0; i < 16 ; i++){
        compSatellites.push( Satellite({
            position: satPositions[i],
            size:{height:20, width:20}
        }));
    }

    // set up the click marker
    clickMarker = ClickMarker();

    // set up the probe 
    probe = Probe();
    fireButton = FireButton(probe);

    // pass all the objects to the controller
    gameController = GameController({   players:compPlayers,
                                        satellites:compSatellites
    });



    // render the things;
    render(ctx);

    // kick off the main loop
    then = Date.now();
    reset();
    mainLoop();
}

var reset = function reset(){         // reset the game
    // reset all the appropriate values
}


var update = function update(timeStep){   // update the objects

    var activePlayer = gameController.getActivePlayer()

    // probe movement && force update
    if(probe.isActive()){

        var probePos = probe.getPos()
        var appliedForce = {x:0, y:0};

        // force update
        activeSats = gameArea.activeSatellites(probePos); // decide which are active
        
        compSatellites.forEach(function(sat){ // reset everything to not active
            sat.setActive(false)
        });
        
        activeSats.forEach(function(satIndex){      // make the right ones active
            compSatellites[satIndex].setActive(true);
            var thisForce =  compSatellites[satIndex].exertForce(probePos);
            appliedForce.x += thisForce.x;
            appliedForce.y += thisForce.y;
        });

        probe.applyForce(appliedForce);

        // move if in bounds
        if(gameArea.inBounds(probePos)){probe.move(timeStep)}else{probe.reset()};
    }
    
    // on a click
    if(keysDown["click"]){

        var clickPos = {    x: keysDown["click"].offsetX,
                            y: keysDown["click"].offsetY}

        // see if we are firing the probe - don't to anything else if it is
        if(fireButton.runClick( clickPos , {launchAngle:compPlayers[activePlayer].getAngle()})){
            delete keysDown["click"]; 
            return
        }

        // check if a satellite was clicked
        compSatellites.forEach( function(sat){
            if( sat.runClick(clickPos) ){
                delete keysDown["click"];  // if it was remove the click as it is dealt with
                return 
            }
        });

    }

    // rotate the ship
    if( keysDown["click"] && keysDown["move"] ){ // if there is a click
        var movePos = {    x: keysDown["move"].offsetX,
                            y: keysDown["move"].offsetY
        }
        compPlayers[activePlayer].rotateToFace(movePos);
    }

    // collision


}

// render the scene
var render = function render(canvasContext){
    
    // draw background
    canvasContext.fillStyle = "#000000";
    canvasContext.fillRect(0,0,canvas.width, canvas.height);

    // draw satellites
    compSatellites.forEach(function(sat){
        sat.draw(canvasContext);
    })

    // updated players using composition
    compPlayers.forEach(function(drawPlayer){
        drawPlayer.draw(canvasContext);
    })

    // render click marker
    //clickMarker.draw(canvasContext)
    probe.draw(canvasContext);
    fireButton.draw(canvasContext);


}

var mainLoop = function mainLoop(){

    var now = Date.now();
    var delta = now - then;

    update( delta/1000 );
    render(ctx);

    then = now;

    // request to do this again ASAP
    requestAnimationFrame(mainLoop);
}
