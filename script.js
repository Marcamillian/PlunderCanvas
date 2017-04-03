var canvas;
var ctx;
var width;
var height;

var then;

var players = [];
var satellites = [];
var compSatellites = [];

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
    var topGutter = 40;
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
    for( var i=0; i < 2; i ++){ players.push(Object.create(ship)); }
    players[0].x = canvas.width/2 - ship.width/2;  // player 1
    players[0].y = topGutter/2 - ship.width/2;
    players[1].x = canvas.width/2 - ship.width/2;  // player 2
    players[1].y = canvas.height - topGutter/2 -ship.height;

    satPositions = gridPositions(satFieldWidth, satFieldHeight, satellite);

    // setup satellites - composed thing
    composedSatellite = Satellite({position:{x:50,y:50}, size:{height:20, width:20}});

    for (var i = 0; i < 16 ; i++){  // rows

        compSatellites.push( Satellite({
            position:{
                x:satPositions[i].x + sideGutter,
                y:satPositions[i].y + topGutter
            },
            size:{height:20, width:20}
        }));
        
        satellites.push(Object.create(satellite));
        satellites[i].x = satPositions[i].x + sideGutter;
        satellites[i].y = satPositions[i].y + topGutter;
        
    }

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

    // ship rotation
    if(keysDown["click"]){

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
        sat.draw();
    })

    // draw the players
    canvasContext.fillStyle = "#00ff00"
    players.forEach(function(drawPlayer){
        canvasContext.fillRect(drawPlayer.x, drawPlayer.y,drawPlayer.width, drawPlayer.height);
    })
    

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
var gridPositions = function gridPositions(spaceWidth, spaceHeight, object){

    // setting out a 4x4 grid
    var spacing_X = spaceWidth / 4;
    var spacing_Y = spaceHeight / 4;
    var positions = [];

    // setup satellites
    for (var i = 0; i < 16 ; i++){  // rows
        positions.push(Object.create(satellite));
        positions[i].x = (spacing_X /2) + i%4 * (spacing_X);
        positions[i].y = (spacing_Y /2)+ Math.floor(i/4)*(spacing_Y);
    }

    return positions;
}