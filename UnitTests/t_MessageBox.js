test = require('tape');
MessageBox = require('./../src/gameObjects/MessageBox');

test("Testing its imported something", (t)=>{
    t.ok(true)
    t.end()
})

test("Testing message setting/getting", (t)=>{
    let messageBox = MessageBox(); 
    let testMessage = "Test Message";

    messageBox.setMessage(testMessage);

    t.equals(messageBox.getMessage(), testMessage, "Testing setting messages");

    t.end()
})

test("test messageBox size/position setting", (t)=>{
    let messageBox = MessageBox( {x:56, y:50}, {width:100, height:100} )

    t.equals(messageBox.getPosY(), 50, "Y pos correct");
    t.equals(messageBox.getPosX(), 56, "X pos correct");
    t.equals(messageBox.getHeight(), 100, "Height correct");
    t.equals(messageBox.getWidth(), 100, "Width correct");

    t.end()
})


