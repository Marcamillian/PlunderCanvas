test = require('tape');
GameObjects = require('./../src/gameObjects/objectBundle.js');

test("Checking the bundle", (t)=>{
    t.ok(GameObjects, "Check the bundle has loaded")
    t.ok(GameObjects.FireButton)
    t.ok(GameObjects.GameArea)
    t.ok(GameObjects.InfoPopUp)
    t.ok(GameObjects.Probe)
    t.ok(GameObjects.Satellite)
    t.ok(GameObjects.Ship)

    t.end()
})