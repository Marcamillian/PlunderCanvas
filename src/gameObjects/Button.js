behaviours = require('./../behaviours.js');

const Button = function Button(arguments){
    
    state = {
         visible: true,
         colour: '#0000ff',
         rotation: 0,
         position: {x:arguments.pos.x, y: arguments.pos.y},
         size: {width: arguments.size.width, height: arguments.size.height}
    }

    return Object.assign(
        {},
        behaviours.renderable(state),
        behaviours.reactToClick(state, arguments.clickFunction)
    )
}

module.exports = Button