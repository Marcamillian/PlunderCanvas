# Plunder Canvas

A prototype for a 2 player strategy game.

:warning: The game logic was the main focus of the project so there is minimal styling and explanation in game.

### Design Notes
  - Vanilla Javascript
  - Object composition
  - Rendering to canvas object

## Installation

### Dependancies
:warning: updating this section shortly
- [Node.js & npm](https://nodejs.org/en/) 
- globally installed npm modules
  - browserify - run command `npm install -g browserify`
  - live-server - run command `npm install -g live-server`


### Installation
:warning: updating this section shortly
- clone the repository
- create **dist** directory in the project folder
- copy `index.html` and `styles.css` from the OldStructure directory into **dist** directory
- Run command `npm run build` in the **project directory**
- Run `live-server` inside the **dist directory**

The app is now running on [localhost:8080](http://localhost:8080)

## Playing the game

### Choosing the win condition
- Click the blue square in the top left to change the win condition
  - point rush - first player to 25 points
  - round rush - get the most points in 10 rounds
  - point lead - get 10 points ahead of your opponent
  - hoarder - have 3 satellites with 15 treasure on each
 
### Start the game
Press the 'm' key to start the game (press 'm' at any point in the game to return to the menu)

### Play the game
A turn has 3 phases - 

**Place Treasure**
Place 10 "treasure" to place on the green "satellites" on screen by clicking on the green squares. The player can only see the number of treasure they have placed on the satellite - though the satellite may contain a hidden number of opposition treasure.

**Fire Probe**
Click on a place on the screen to aim the ship (white rectangle).
Click the blue button next to the ship to fire the probe (pink square). The probe will travel through the satellites - being drawn towards satellites containing treasure (both yours and your opponents).

**Steal treasure**
Using the path of the probe - try to guess where the opponents treasure may be hidden. If the satellite was drawn towards a satellite more than you would expect for the number of treasure you have placed - click the satellite to steal the opponents treasure on that satellite.

Swap players at the prompt - with the non-active player averting their eyes from the screen.

Continue playing rounds until the win condition had been reached



## Implementation Notes

The entry point to the application is a file named mainScript.js - this loads and instanciates the module that controls the app "AppManager".

### AppManager
This handles
- Creating the canvas to render the gme to
- Running the main loop
  - tracking the time difference between frames
  - calling the update function on the current module (passing time delta and inputs)
  - calling the render function on the current module
- Setting up player inputs (keyDown event handlers etc)
- Changing active modules

The app Manager contains instances of the game modules - currently these modules are
- Game Module - running a normal game
- Menu Module - running the menu screen at the beginning of the game
- Tutorial Module - running the tutorial with small challenges using the same mechanics to teach the game

Each module is created with a factory function containing a private internal state. Modules implement render & update functions that are called by the AppManager.

### Game Objects
Game objects are all created with factory functions with internal private states. The objects take advantage of object composition with standard functions such as renderable, reactToClick, mover etc defined in he **behaviours.js** file.


