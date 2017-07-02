gObjs = require('./../gameObjects/objectBundle.js');

const TutorialModule = function TutorialModule(screenSize){
    var state = {
        tutorialLayout: undefined,
        player: undefined,
        satellites: []
    }

    var init = function init(screenSize){
        state.tutorialLayout = gObjs.TutorialLayout(screenSize)
        state.player = gObjs.Ship(state.tutorialLayout.layoutPlayer());
        

    }(screenSize)

    var render = function render(ctx){

        // clear everything
        ctx.save()
        ctx.fillStyle = "#000000";
        ctx.fillRect(0,0,state.tutorialLayout.screenSize('width'), state.tutorialLayout.screenSize('height'));
        ctx.restore()

        state.player.draw(ctx)
    }

    var update = function update(timeStep, keysDown){
        if(keysDown['click']){
            var clickPos = {    x: keysDown['click'].offsetX,
                                y: keysDown['click'].offsetY
            }

            if(keysDown["click"] && keysDown['move']){
                var movePos = { x: keysDown['move'].offsetX,
                                y: keysDown['move'].offsetY
                }

                state.player.rotateToFace(movePos);
            }
        }
    }

    return Object.assign(
        {
            render: render,
            update:update
        }
    )
}

module.exports = TutorialModule