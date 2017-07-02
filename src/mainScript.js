var appManager = require('./AppManager.js');

init = function init(){
    appManager.init()
}
// -- launch order
// App Manager -- initiates the other states - holds the flow
    // Menu Manager-- draws the menu and holds the logic
    // Tutorial Manager -- draws the tutotial and holds the logic
    // Game Manager -- draws the game flow and holds the logic



