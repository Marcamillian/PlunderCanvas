var behaviours = require('./../behaviours.js');

// OBJECT FOR WHERE YOU CLICK 
const ClickMarker = function ClickMarker(){
    var state = {
        colour: '#ff69b4',
        visible:true,
        position: { x:20, y:20},
        size: {width:10, height:10}
    }
    return Object.assign(
        {},
        behaviours.renderable(state),
        behaviours.moveToClick(state)
    )
}

module.exports = ClickMarker;