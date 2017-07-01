Button = require('./../gameObjects/Button.js')
FireButton = require('./../gameObjects/FireButton.js')

const MenuModule = function MenuModule(dimUnits){
    var state = {
        objects : []
    }

    const init = function init(dimUnits){
    
        var button_modeLead = Button({
            pos: {x:dimUnits.width*50, y:dimUnits.height*50},
            size: {width:dimUnits.width*20, height:dimUnits.height*20},
            clickFunction: function(){console.log("Point Lead mode")}
        })
        state.objects.push(button_modeLead)

        var button_modePRush = Button({
            pos: {x:dimUnits.width*100, y:dimUnits.height*50},
            size: {width:dimUnits.width*20, height:dimUnits.height*20},
            clickFunction: function(){console.log("Point Rush mode")}
        })
        state.objects.push(button_modePRush)

        var button_modeRRush = Button({
            pos: {x:dimUnits.width*150, y:dimUnits.height*50},
            size: {width:dimUnits.width*20, height:dimUnits.height*20},
            clickFunction: function(){console.log("Round Rush mode")}
        })
        state.objects.push(button_modeRRush)

        var button_modeHoard = Button({
            pos: {x:dimUnits.width*200, y:dimUnits.height*50},
            size: {width:dimUnits.width*20, height:dimUnits.height*20},
            clickFunction: function(){console.log("Hoard mode")}
        })
        state.objects.push(button_modeHoard)


    }(dimUnits)

    const update = function update(timeStep, keysDown){
        
        // Click interactions
        if(keysDown["click"]){
            var clickPos = {    x: keysDown['click'].offsetX,
                                y: keysDown['click'].offsetY
            }

            // run the clicks on the objects
            state.objects.forEach((obj)=>{
                if(obj.runClick(clickPos)){
                    delete keysDown['click']
                }
            })
            
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
        ctx.translate(dimUnits.width*50, dimUnits.height*50)
        ctx.fillText("SOME MENU ITEM", 0,0)
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