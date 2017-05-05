var test = require('tape');
var gameObjects = require('./gameObjects.js');

console.log(gameObjects);

/* // not required if we can export the objects in a file
fs.readFile('./gameObjects.js', function(err, data){
    if(err){throw err}
    console.log(data.toString())
})*/ 

/*
test('timing test', function (t){
    t.plan(2);

    t.equal(typeof Date.now, 'function');

    var start = Date.now();

    setTimeout(function(){
        t.equal(Date.now() - start, 100);
    }, 100);
});*/

test('objectTest', function(t){
    t.plan(1);  // only planning to do one test

    t.equal(gameObjects.foo, 5)

})