gObjs = require('./../gameObjects/objectBundle.js');

const TutorialModule = function TutorialModule(screenSize){
    var state = {
        tutorialLayout: undefined,
        player: undefined,
        satellites: [],
        fireButon: undefined,
        probe: undefined
    }

    var init = function init(screenSize){
        // create the layout helper
        state.tutorialLayout = gObjs.TutorialLayout(screenSize)

        // create the players ship
        state.player = gObjs.Ship({position: state.tutorialLayout.layoutPlayer()});
        
        // set up the satellites
        var satPositions = state.tutorialLayout.layoutSatellites()
        satPositions.forEach((satPos)=>{
            var sat = gObjs.Satellite({ position: satPos,
                                        size: {width: 20, height: 20}
            })
            state.satellites.push(sat)
        })

        // set up the probe
        state.probe = gObjs.Probe(state.tutorialLayout.layoutPlayer())

        // set up the fire button
        state.fireButton = gObjs.FireButton(state.tutorialLayout.layoutFireButton(), state.probe)

    }(screenSize)

    var render = function render(ctx){

        // clear everything
        ctx.save()
        ctx.fillStyle = "#000000";
        ctx.fillRect(0,0,state.tutorialLayout.screenSize('width'), state.tutorialLayout.screenSize('height'));
        ctx.restore()

        state.player.draw(ctx)
        state.satellites.forEach((sat)=>{sat.draw(ctx)})
        state.fireButton.draw(ctx)
        state.probe.draw(ctx)
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