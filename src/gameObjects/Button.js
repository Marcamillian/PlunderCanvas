behaviours = require('./../behaviours.js');

const Button = function Button(arguments){
    const colors = ['#0000ff', '#ff69b4']
    state = {
         visible: true,
         colour: '#0000ff',
         rotation: 0,
         position: {x:arguments.pos.x, y: arguments.pos.y},
         size: {width: arguments.size.width, height: arguments.size.height}
    }

    var toggleActive = function toggleActive(){
        var colIndex = colors.indexOf(state.colour) +1
        state.colour = (colIndex < colors.length) ? colors[colIndex] : colors[0]
    }

    return Object.assign(
        {toggleActive: toggleActive},
        behaviours.renderable(state),
        behaviours.reactToClick(state, arguments.clickFunction)
    )
}

module.exports = Button