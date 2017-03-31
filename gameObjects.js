// game objects
var ship = {
    name:"playerOne",
    direction:0,
    x:0,
    y:0,
}.prototype = {
    width:20,
    height:40
}

var satellite = {
    x:0,
    y:0,
    store:{playerOne:0, playerTwo:0}
}.prototype = {
    width:20,
    height:20
}

var probe = {
    x:0,
    y:0
}.prototype = {
    speed:10
}