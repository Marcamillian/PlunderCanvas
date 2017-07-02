test = require('tape');
GameArea = require('../src/gameObjects/GameArea.js')

test("Testing the grid layout", (t)=>{
    gameArea = GameArea(1, 1);

    t.ok(gameArea, "Test it is created")

    t.end()
})