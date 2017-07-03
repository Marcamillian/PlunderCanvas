const TutorialLayout = function LayoutTutorial(screenSize){

    var state = {
        screenSize:{ width:undefined, height: undefined },
        U:{ x:undefined, y: undefined },
        gutters:{ side: undefined, top: undefined},
        satFieldSize:{ width: undefined, height: undefined },
        satelliteSpacing:{ x: undefined, y:undefined},
        playerPos:{ x: undefined, y: undefined},
        gravRange: undefined
    }

    var init = function init(screenSize){
        state.screenSize = {width: screenSize.width, height: screenSize.height};
        state.U = { x: state.screenSize.width/100, y: state.screenSize.height/100}
        state.gutters = { side: 0*state.U.x, top: 50*state.U.y};
        state.satFieldSize = { width: 100*state.U.x - 2*state.gutters.side,
                                height: 100*state.U.y - 2*state.gutters.top
        }
        state.playerPos = { x: 50*state.U.x, y:90*state.U.y}
        state.gravRange = 20*state.U.x;
    }(screenSize)

    var layoutPlayer = function layoutPlayer(){
        return {x:state.playerPos.x, y: state.playerPos.y}
    }

    var layoutSatellites = function layoutSatellites(){ // produces a squa
        return [
            {x: 33*state.U.x, y: 33*state.U.y},
            {x: 66*state.U.x, y: 33*state.U.y},
            {x: 33*state.U.x, y: 33*state.U.y + 33*state.U.x},
            {x: 66*state.U.x, y: 33*state.U.y + 33*state.U.x}
        ]
    }

    var layoutFireButton = function layoutFireButton(){
        return {x:25*state.U.x, y: 90*state.U.y }
    }

    var layoutGuessButton = function layoutGuessButton(){
        return {x: 50*state.U.x, y: 10*state.U.y}
    }

    var screenSize = function screenSize(dim){
        return (dim == 'width') ? state.screenSize.width : (dim =="height") ? state.screenSize.height: undefined
    }

    var inBounds = function inBounds(probePos){
        return (probePos.x > 5 && probePos.x < state.screenSize.width -5
                && probePos.y > 5 && probePos.y < state.screenSize.height - 5) ? true : false
    }
    var getActiveSatellites = function getActiveSatellites(probePos){
        var satPositions = layoutSatellites();
        var active = []

        satPositions.forEach((sat, index)=>{
            var a = probePos.x - sat.x;
            var b = probePos.y - sat.y;
            var c = Math.sqrt(Math.pow(a,2) + Math.pow(b,2))
            if(c < state.gravRange){active.push(index)}
        })
        
        return active
    }

    return Object.assign(
        {   layoutPlayer: layoutPlayer,
            screenSize: screenSize,
            layoutSatellites: layoutSatellites,
            layoutFireButton: layoutFireButton,
            layoutGuessButton: layoutGuessButton,
            inBounds: inBounds,
            getActiveSatellites: getActiveSatellites,
        }
    )
}

module.exports = TutorialLayout