gObjs = require('./../gameObjects/objectBundle.js');

const TutorialModule = function TutorialModule(screenSize){
    const modes = ['discover', 'interfere', 'overlap']
    var state = {
        messageWindow: undefined,
        tutorialLayout: undefined,
        player: undefined,
        satellites: [],
        fireButon: undefined,
        probe: undefined,
        mode: undefined,
        guessButton: undefined,
        guess: false
    }
    var init = function init(screenSize, treasureDist){
        
        
        { // == LAY OUT ALL THE ELEMENTS

            // create the layout helper
            state.tutorialLayout = gObjs.TutorialLayout(screenSize)

            state.messageWindow = gObjs.InfoPopUp({ position: state.tutorialLayout.layoutMessageWindow(),
                                                    size: { height: 50, width: 350}
            })

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

            // add in the button to confirm the guess
            state.guessButton = gObjs.Button({ pos: state.tutorialLayout.layoutGuessButton(),
                                                size: {width: 50, height: 50},
                                                clickFunction: ()=>{
                                                    toggleGuessMode()
                                                    state.guessButton.toggleActive();
                                                }}
            )

        }

        // == Add the treasure based on scenario
        switch(treasureDist){
            case 'discover':
                state.mode = 'discover'
                var hideSatIndex = Math.floor(Math.random()*state.satellites.length)
                state.satellites[hideSatIndex].addLoot(1,10)// put loot on sat 1
            break;
            case 'interfere':   // your treasure will deflect the probe too
                state.mode = 'interfere'
                var hideSatIndex = Math.floor(Math.random()*2)
                state.satellites[hideSatIndex].addLoot(1,10)// put loot on one of the back satellites
                state.satellites[3].addLoot(0,10)// put loot on sat 1
                state.satellites[2].addLoot(0,10)// put loot on sat 1
            break;
            case 'overlap':
                state.mode = 'overlap'
                var hideSatIndex = Math.floor(Math.random()*state.satellites.length)
                var decoySatIndex = Math.floor(Math.random()*state.satellites.length)
                while(hideSatIndex == decoySatIndex){ decoySatIndex = Math.floor(Math.random()*state.satellites.length) } // make sure that they are not the same

                state.satellites[hideSatIndex].addLoot(0,10)// put loot on sat 1
                state.satellites[hideSatIndex].addLoot(1,10)// put loot on sat 1
                state.satellites[decoySatIndex].addLoot(0,10)// put loot on sat 1
            break
        }
    }
    init(screenSize, modes[modes.length-1])

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
        state.guessButton.draw(ctx)
        state.messageWindow.draw(ctx)
    }

    var update = function update(timeStep, keysDown){

        // clear the message box if its open
        if(keysDown['click'] && state.messageWindow.getVisible()){
            state.messageWindow.toggleShow();
            delete keysDown['click']
            return
        }

        // see if we are in guess mode
        if(state.guess == true){
            

            if(keysDown['click']){ // if there is a click

                var clickPos = {x:keysDown['click'].offsetX,
                                y: keysDown['click'].offsetY}

                // switch out of guess mode if you want
                if(state.guessButton.runClick(clickPos)){
                    delete keysDown['click']
                    return
                }

                // check if the satellite is clicked
                state.satellites.forEach((sat, index)=>{
                    if(sat.runClick(clickPos, 2)){
                        checkSatellite(index)
                        delete keysDown["click"]
                    }
                })
            }
            

            return
        }

        // deal with the clicks
        if(keysDown['click']){
            var clickPos = {    x: keysDown['click'].offsetX,
                                y: keysDown['click'].offsetY
            }

            // see if we fired the probe
            if(!state.probe.isActive() && state.fireButton.runClick( clickPos , {launchAngle:state.player.getAngle()})){
                delete keysDown["click"];
                return
            }

            if(state.guessButton.runClick(clickPos)){
                delete keysDown['click']
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
            messageWindow: undefined,
            tutorialLayout: undefined,
            player: undefined,
            satellites: [],
            fireButon: undefined,
            probe: undefined,
            mode: undefined,
            guessButton: undefined,
            guess: false,
        }
    }

    var toggleMode = function toggleMode(){
        var modeIndex = modes.indexOf(state.mode) +1;
        var screenSize = {width:state.tutorialLayout.screenSize('width'),
                            height: state.tutorialLayout.screenSize('height')}

        modeName = (modeIndex < modes.length)? modes[modeIndex] : modes[0]
        
        reset()
        init(screenSize, modeName)
    }

    var toggleGuessMode = function toggleGuessMode(){
        state.guess = !state.guess
    }

    var checkSatellite = function checkSatellite(satIndex){
        if(state.satellites[satIndex].getPlayerLoot(1) != 0){
            state.messageWindow.setMessage(" CORRECT !")
        }else{
            state.messageWindow.setMessage(" Not That one !")
        }
        state.messageWindow.toggleShow()
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