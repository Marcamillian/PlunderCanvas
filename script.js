var canvas;
var ctx;
var width;
var height;

var then; // date() of previous frame 

var gameController = {};
var gameArea = {}; // object to contain the state of the play field and untility functions
var players = []; // array of players
var satellites = [];   // array of satellites
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
    players.push(Ship({ // player 1
        position:{ x: canvas.width/2, y: topGutter/2}
    }));
    players.push(Ship({ // player 2
        position:{x: canvas.width/2, y: canvas.height - topGutter/2}
    }))

    // ===  setup satellites === 

    // get positions
    satPositions = gameArea.gridPositions();

    // make the satellites
    for (var i = 0; i < 16 ; i++){
        satellites.push( Satellite({
            position: satPositions[i],
            size:{height:20, width:20}
        }));
    }

    // set up the click marker
    clickMarker = ClickMarker();

    // set up the probe 
    probe = Probe();
    fireButton = FireButton(probe);

    // set up the messaging object
    messageWindow = InfoPopUp( {    position:{x:200, y:300},
                                    size:{width: canvas.width-10, height:canvas.height-100}
                                    });

    // pass all the objects to the controller
    gameController = GameController({   players:players,
                                        satellites:satellites,
                                        probe: probe,
                                        messageBox: messageWindow,
                                        fireButton: fireButton,
                                        ai: true
    });

    // create the AI opposition
    aiPlayer = AIOpposition();

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
    var updateClickPos = (keysDown["click"]) ? {x: keysDown["click"].offsetX, y: keysDown["click"].offsetY} : undefined
    var isPlayerAi = gameController.isPlayerAI();
    var roundPhase = gameController.getPhase()


    // check if the message window is clicked so that you can hide it
    if(messageWindow.getVisible() && keysDown["click"]){

        var clickPos = {    x: keysDown["click"].offsetX,
                            y: keysDown["click"].offsetY}
        messageWindow.runClick(clickPos);

        // check to see if the game needs resetting
        if(gameController.gameEnded()){gameController.endAccepted()}

        return;
    }

    switch(roundPhase){
        case 0: // PHASE 1 == setting score on satellites
            
        // == AI LOGIC == 

            if(isPlayerAi){ // if the ai players turn
                // update the view of the field
                
                console.log("AI thinking")
                aiPlayer.update({   roundPhase:roundPhase,
                                    // satelliteArray: // some satellite array
                                    currentPoints: gameController.getScores(activePlayer)
                })

                updateClickPos = aiPlayer.getClickPos(roundPhase)
            }

        // == PLAYER INTERACTION LOGIC == 

            if(updateClickPos){ // if there is a click

                    // check if a satellite was clicked
                    satellites.forEach( function(sat){    
                        if( sat.runClick(updateClickPos, {phase: gameController.getPhase()} ) ){
                            delete keysDown["click"];  // if it was remove the click as it is dealt with 
                            gameController.satAdded();
                        }
                    });
                    break
                }

            break;
        case 1: // PHASE 2 === aiming and firing the probe

        // == ALL OF THE AI LOGIC == 
            if(isPlayerAi){ // if the ai players turn - set a click position
                
                // update either chosing a direction to fire OR watching satellite
                aiPlayer.update({   roundPhase: roundPhase,   // what update phase we are using
                                    probeFired: probe.isActive(),  // whether we are waiting for fire or watching the probe
                                    timeStep: timeStep,        // useful for predicting the flight of the probe
                                    probePos: probe.getPos()
                })

                if(!probe.isActive()){  // if its before the probe being fired
                    updateClickPos = aiPlayer.getClickPos(roundPhase) // get where the AI is targetting
                                                                            // CASE 1 - placing satellites
                                                                            // CASE 2 - clicking on the fire button
                    players[activePlayer].rotateToFace(updateClickPos); // turn to face -- only on satellite place

                    if(fireButton.runClick( {x:60, y:580} , {launchAngle:players[activePlayer].getAngle()})){  // fire
                        delete keysDown["click"];
                        break
                    }
                }

            } else { // check for player interaction

            // == ALL OF THE PLAYER INTERACTION LOGIC == 

                if(updateClickPos && !probe.isActive()){ // if there is a click and the probe is not active
                    if(fireButton.runClick( updateClickPos , {launchAngle:players[activePlayer].getAngle()})){  // see if the fire button is pressed
                        delete keysDown["click"];   // if it is - don't do anthing else
                        return
                    }
                }

                // if it is a human players tune && there is a click down && the mouse if moved
                if( !isPlayerAi && updateClickPos && keysDown["move"] ){ // if there is a click
                    var movePos = {    x: keysDown["move"].offsetX,
                                        y: keysDown["move"].offsetY
                    }
                    players[activePlayer].rotateToFace(movePos);    // rotate the ship towards the click
                }
            }

        // === GENERAL PROBE UPDATE (movement / forces acting on) == 

            // if the probe has been fired (is active)
            if(probe.isActive()){

                var probePos = probe.getPos()

                var appliedForce = {x:0, y:0};

                // force update
                activeSats = gameArea.activeSatellites(probePos); // decide which are active
                
                satellites.forEach(function(sat){ // reset everything to not active
                    sat.setActive(false)
                });

                activeSats.forEach(function(satIndex){      // make the right ones active
                    satellites[satIndex].setActive(true);
                    var thisForce =  satellites[satIndex].exertForce(probePos);
                    appliedForce.x += thisForce.x;
                    appliedForce.y += thisForce.y;
                });

                probe.applyForce(appliedForce);
                probe.update(timeStep);

                // move if in bounds
                if(gameArea.inBounds(probePos)){probe.move(timeStep)}else{probe.expire()};
            }
            break;
        case 2: // PHASE 3 == choosing a satellite to steal from 

        // == AI LOGIC==

            if(isPlayerAi){ // if the ai players turn
                updateClickPos = aiPlayer.getClickPos(roundPhase)
            }else{  // if the players turn
                
            }

        // == PLAYER INTERACTIONS == 

            if(updateClickPos){
                // check if a satellite was clicked
                satellites.forEach( function(sat, index){    
                    if( sat.runClick(updateClickPos, {phase: gameController.getPhase()} ) ){
                        gameController.setSatelliteStolen(index);
                        delete keysDown["click"];  // if it was remove the click as it is dealt with 
                    }
                });
            }
            
            break

    }

    gameController.update();

}

// render the scene
var render = function render(canvasContext){
    
    // draw background
    canvasContext.fillStyle = "#000000";
    canvasContext.fillRect(0,0,canvas.width, canvas.height);

    // draw scores
    gameController.drawScores(canvasContext);

    // draw satellites
    satellites.forEach(function(sat){
        sat.draw(canvasContext);
    })

    probe.draw(canvasContext);
    fireButton.draw(canvasContext);

    // updated players using composition
    players.forEach(function(drawPlayer){
        drawPlayer.draw(canvasContext);
    })

    // render click marker
    //clickMarker.draw(canvasContext)

    // draw the suspicionn
    aiPlayer.drawSuspicion(canvasContext, probe.getPos());
    
    // render the info window
    messageWindow.draw(canvasContext);


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
