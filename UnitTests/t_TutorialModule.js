test = require('tape')
TutorialModule = require('./../src/modules/TutorialModule.js')

test("Testing the module", (t)=>{
    var tutorialModule = TutorialModule({x: 1, y:1});

    t.ok(tutorialModule)

    t.end()

})

