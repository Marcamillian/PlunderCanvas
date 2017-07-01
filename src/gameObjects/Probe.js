const Probe = function Probe(){
    const defaultSpeed = 100;
    const defaultLifetime = 9; // flight time in seconds
    var state = {
        visible: true,
        colour: '#ff69b4',
        position: { x:200 , y:20 },
        size: {width: 10, height:10},
        active: false,
        speed:{x:0, y:defaultSpeed},
        exipred: false,
        lifetime: defaultLifetime 
    }
    var update = function update(timeDelta){
        state.lifetime -= timeDelta;
    }
    var reset = function reset(arguments){
        state.position = (arguments == undefined) ? {x:200, y:20} : arguments.position;
        state.speed = {x:0,y:defaultSpeed};
        state.active = false;
        state.expired = false;
        state.lifetime = defaultLifetime;
    }
    var trigger = function trigger(givenState, triggerArgs){
        if (triggerArgs.launchAngle) { state.speed = resolveLaunchAngle(triggerArgs.launchAngle) }
        givenState.active = true;
    }
    var getPos= function getPos(){
        return state.position;
    }
    var setPosition = function setPosition(newPosition){
        state.position = newPosition;
    }
    var applyForce = function applyForce(forceVector){
        state.speed.x += Math.max(-100, Math.min( forceVector.x, 100));
        state.speed.y += Math.max(-100, Math.min( forceVector.y, 100))
    }
    var toggleActive = function toggleActive(isActive){
        (isActive == undefined) ? state.active = !state.active : state.active = isActive;
    }
    var resolveLaunchAngle = function resolveLaunchAngle(angle){
        // angle from vertical
        return {    x: defaultSpeed * Math.sin(angle * ( (Math.PI)/180) ),
                    y: -defaultSpeed * Math.cos(angle * ( (Math.PI)/180) )
        }
    }
    var expire = function(){
        state.expired = true;
        state.active = false;
    }
    var isExpired = function (){
        return state.expired;
    }
    return Object.assign(
        { update:update,
        reset: reset,
        trigger:trigger,
        getPos:getPos,
        applyForce: applyForce,
        toggleActive:toggleActive,
        setPosition: setPosition,
        expire: expire,
        isExpired: isExpired},
        renderable(state),
        stateReporter(state),
        mover(state)
    )
}

module.exports = Probe