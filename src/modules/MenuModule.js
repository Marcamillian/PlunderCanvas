Button = require('./../gameObjects/Button.js')
FireButton = require('./../gameObjects/FireButton.js')

const MenuModule = function MenuModule(dimUnits){
    var state = {
        objects : []
    }

    const init = function init(dimUnits){
    
        var button = Button({
            pos: {x:dimUnits.width*50, y:dimUnits.height*50},//x: dimUnits.width*50, y: dimUnits.height*20},
            size: {width:dimUnits.width*20, height:dimUnits.height*20},//width: dimUnits.width*10, height:dimUnits*2.5},
            clickFunction: function(){console.log("Been Clicked")}
        })

        state.objects.push(button)
    }(dimUnits)

    const update = function update(timeStep, keysPressed){
        
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