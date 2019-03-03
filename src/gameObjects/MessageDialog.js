behaviours = require('./../behaviours.js')
MessageBox = require('./MessageBox')
Button = require('./Button.js')

const MessageDialog = function MessageDialog(
    position = { x:200, y:200 },
    size = { width:200, height:200 },
    callbacks = {
        nextPage:()=>{console.log("nextPage clicked")},
        lastPage:()=>{console.log("lastPage clicked")},
        nextChapter:()=>{console.log("nextChapter clicked")},
        lastChapter:()=>{console.log("lastChapter clicked")}
    }
){
    state = {
        position = position,
        size = size,
        nextPageButton = undefined,
        lastPageButton = undefined,
        nextChapterButton = undefined,
        lastChapterButon = undefined,
        messageBox = undefined
    }

    var init = function init(){

        state.nextPageButton = Button();
        state.lastPageButton = Button();
        state.nextChapterButton = Button();
        state.lastChapterButton = Button();
        messageBox = MessageBox();
    }

    var renderComponents = function renderComponents(ctx){
        [
            lastChapterButton,
            lastPageButton,
            messageBox,
            nextPageButton,
            nextChapterButton
        ].forEach( component.draw(ctx) )
    }

    
    return Object.assign(
        {

        },
        behaviours.renderable(state)
    )
}