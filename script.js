var canvas;
var ctx;
var width;
var height;

var then;

var compPlayers = [];
var satellites = [];
var compSatellites = [];
var clickMarker = {};

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
    });

    canvas.addEventListener("mouseup",function(){
        delete keysDown["click"];
    })

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

    // setup satellites
    satPositions = gridPositions(satFieldWidth, satFieldHeight); // get the spacing for the satellites

    for (var i = 0; i < 16 ; i++){
        compSatellites.push( Satellite({
            position:{
                x:satPositions[i].x + sideGutter,
                y:satPositions[i].y + topGutter
            },
            size:{height:20, width:20}
        }));
    }

    // set up the click marker
    clickMarker = ClickMarker();

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

    // movement

    // satellite click


    // on a click
    if(keysDown["click"]){

        var clickPos = {    x: keysDown["click"].offsetX,
                            y: keysDown["click"].offsetY}

        // move the click marker
        clickMarker.moveTo({ x: clickPos.x , y: clickPos.y})

        // rotate the ship
        compPlayers[0].rotateToFace({ x: clickPos.x, y: clickPos.y})

        // check satellite click
        compSatellites.forEach( function(sat){
            sat.runClick( { x:clickPos.x , y:clickPos.y })
        });

        delete keysDown["click"];

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
    compPlayers.forEach(function(drawPlayer){  // TODO: the composed player is not drawing apparently
        drawPlayer.draw(canvasContext);
    })

    // render click marker
    clickMarker.draw(canvasContext)

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


// helper FUNCTIONS
var gridPositions = function gridPositions(spaceWidth, spaceHeight){

    // setting out a 4x4 grid
    var spacing_X = spaceWidth / 4;
    var spacing_Y = spaceHeight / 4;
    var positions = [];

    // setup satellites
    for (var i = 0; i < 16 ; i++){  // rows
        positions.push({});
        positions[i].x = (spacing_X /2) + i%4 * (spacing_X);
        positions[i].y = (spacing_Y /2)+ Math.floor(i/4)*(spacing_Y);
    }

    return positions;
}