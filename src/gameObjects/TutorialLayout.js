const TutorialLayout = function LayoutTutorial(screenSize){
    var state = {
        absScreenSize:{ width:undefined, height: undefined },
        U:{ x:undefined, y: undefined },
        gutters:{ side: undefined, top: undefined},
        satFieldSize:{ width: undefined, height: undefined },
        satelliteSpacing:{ x: undefined, y:undefined},
        playerPos:{ x: undefined, y: undefined}
    }

    var init = function init(screenSize){
        state.absScreenSize = {width: screenSize.width, height: screenSize.height};
        state.U = { x: state.absScreenSize.width/100, y: state.absScreenSize.height/100}
        state.gutters = { side: 0*state.U.x, top: 50*state.U.y};
        state.satFieldSize = { width: 100*state.U.x - 2*state.gutters.side,
                                height: 100*state.U.y - 2*state.gutters.top
        }
        state.playerPos = { x: 50*state.U.x, y:90*state.U.y}
    }(screenSize)

    var layoutPlayer = function layoutPlayer(){
        return state.playerPos
    }

    var layoutSatellites = function layoutSatellites(satWidth){ // produces a squa
        return [
            {x: 33*state.U.x, y: 33*state.U.y},
            {x: 66*state.U.x, y: 33*state.U.y},
            {x: 33*state.U.x, y: 66*state.U.y},
            {x: 66*state.U.x, y: 66*state.U.y}
        ]
    }

    var screenSize = function screenSize(dim){
        return (dim == 'width') ? state.absScreenSize.width : (dim =="height") ? state.absScreenSize.height: undefined
    }

    return Object.assign(
        {   layoutPlayer: layoutPlayer,
            screenSize: screenSize
        }
    )
}

module.exports = TutorialLayout