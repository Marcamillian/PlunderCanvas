Button = require('./../gameObjects/Button.js')
FireButton = require('./../gameObjects/FireButton.js')
Ship = require('./../gameObjects/Ship.js')

const MenuModule = function MenuModule(dimUnits, callbackFunctions){
    var state = {
        objects : [],
        pointer: undefined,
        modeName: "point lead"
    }

    const init = function init(dimUnits){
    
        console.log(callbackFunctions)

        var button_modeToggle = Button({
            pos: {x:dimUnits.width*50, y:dimUnits.height*50},
            size: {width:dimUnits.width*20, height:dimUnits.height*20},
            clickFunction: ()=>{state.modeName = callbackFunctions.modeToggle()}
        })
        state.objects.push(button_modeToggle)

        var button_startGame = Button({
            pos: {x:dimUnits.width*50, y:dimUnits.height*100},
            size: {width:dimUnits.width*20, height:dimUnits.height*20},
            clickFunction: ()=>{callbackFunctions.startGame()}
        })
        state.objects.push(button_startGame)

        var ship_pointer = Ship({
            position: {x: dimUnits.width*200, y:dimUnits.height*500}
        })
        state.objects.push(ship_pointer)
        state.pointer = ship_pointer;


    }(dimUnits)

    const update = function update(timeStep, keysDown){
        
        // Click interactions
        if(keysDown["click"]){
            var clickPos = {    x: keysDown['click'].offsetX,
                                y: keysDown['click'].offsetY
            }

            // run the clicks on the objects
            state.objects.forEach((obj)=>{
                if(obj.runClick){
                    if(obj.runClick(clickPos)){ delete keysDown['click'] }
                }
            })

            if(state.pointer.rotateToFace(clickPos)){
                delete keysDown['click']
            }
            
        }

    }

    const render = function render(ctx){

        // clear everything
        ctx.save()
        ctx.fillStyle = "#000000";
        ctx.fillRect(0,0,dimUnits.width*400, dimUnits.height*600);
        ctx.restore()

        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.translate(dimUnits.width*200, dimUnits.height*50)
        ctx.fillText("MODE: " + state.modeName, 0,0)
        ctx.restore()

        state.objects.forEach((obj)=>{if(obj.draw){obj.draw(ctx)}})
    }

    return Object.assign(
        {   init: init,
            update: update,
            render: render
        }
    )
}

module.exports = MenuModule