gObjs = require('./../gameObjects/objectBundle.js');

const TutorialModule = function TutorialModule(screenSize){
    const modes = ['discover', 'interfere']
    var state = {
        tutorialLayout: undefined,
        player: undefined,
        satellites: [],
        fireButon: undefined,
        probe: undefined,
        mode: undefined
    }
    var init = function init(screenSize, setupName){
        switch(setupName){
            case 'discover':
                state.mode = 'discover'
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
                state.satellites[0].addLoot(1,10)// put loot on sat 1

                // set up the probe
                state.probe = gObjs.Probe(state.tutorialLayout.layoutPlayer())

                // set up the fire button
                state.fireButton = gObjs.FireButton(state.tutorialLayout.layoutFireButton(), state.probe)
            break;
            case 'interfere':
                state.mode = 'interfere'
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
                state.satellites[0].addLoot(1,10)// put loot on sat 1
                state.satellites[3].addLoot(0,10)// put loot on sat 1

                // set up the probe
                state.probe = gObjs.Probe(state.tutorialLayout.layoutPlayer())

                // set up the fire button
                state.fireButton = gObjs.FireButton(state.tutorialLayout.layoutFireButton(), state.probe)
            break;
        }
    }
    init(screenSize, 'interfere')

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
        // deal with the clicks
        if(keysDown['click']){
            var clickPos = {    x: keysDown['click'].offsetX,
                                y: keysDown['click'].offsetY
            }

            // see if we fired the probe
            if(state.fireButton.runClick( clickPos , {launchAngle:state.player.getAngle()})){
                delete keysDown["click"];
                return
            }

            // move the ship
            if(keysDown["click"] && keysDown['move']){
                var movePos = { x: keysDown['move'].offsetX,
                                y: keysDown['move'].offsetY
                }

                state.player.rotateToFace(movePos);
            }
        }

        // update the objects for time
        if(state.probe.isActive()){

            var probePos = state.probe.getPos()
            var force = {x:0, y:0}


            // === TODO: apply the forces to the probe
            var activeSats = state.tutorialLayout.getActiveSatellites(probePos)

            activeSats.forEach((satIndex)=>{
                var thisForce = state.satellites[satIndex].exertForce(probePos)
                force.x += thisForce.x;
                force.y += thisForce.y
            })  

            state.probe.applyForce(force)
            // === 

            state.probe.update(timeStep) // update for expiry
            state.probe.move(timeStep)  // move the probe

            // out of bounds become inactive
            if(!state.tutorialLayout.inBounds(probePos)){
                state.probe.reset({position: state.tutorialLayout.layoutPlayer()})
            }
            // expired inactive
            

        }
        // reset the probe if its out of bounds
        
    }

    var reset = function reset(){
        state = {
            tutorialLayout: undefined,
            player: undefined,
            satellites: [],
            fireButon: undefined,
            probe: undefined,
            mode: undefined
        }
    }

    var toggleMode = function toggleMode(){
        var modeIndex = modes.indexOf(state.mode) +1;
        var screenSize = {width:state.tutorialLayout.screenSize('width'),
                            height: state.tutorialLayout.screenSize('height')}

        console.log("tutorial mode: ", modeIndex)
        modeName = (modeIndex < modes.length)? modes[modeIndex] : modes[0]
        
        reset()
        init(screenSize, modeName)
    }

    return Object.assign(
        {
            render: render,
            update:update,
            toggleMode: toggleMode
        }
    )
}

module.exports = TutorialModule