// bundle together all of the objects (working on individual files is easier)
var ClickMarker = require('./ClickMarker.js')
var FireButton = require('./FireButton.js');
var GameArea = require('./GameArea.js')
var InfoPopUp = require('./InfoPopUp.js')
var Probe = require('./Probe.js')
var Satellite = require('./Satellite.js')
var Ship = require('./Ship.js')
var TutorialLayout = require('./TutorialLayout.js')
var Button = require('./Button.js')

module.exports = {
    ClickMarker: ClickMarker,
    FireButton: FireButton,
    GameArea: GameArea,
    InfoPopUp: InfoPopUp,
    Probe: Probe,
    Satellite: Satellite,
    Ship: Ship,
    TutorialLayout: TutorialLayout,
    Button: Button
}