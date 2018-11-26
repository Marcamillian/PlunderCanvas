behaviours = require('./../behaviours.js');

const GameScript = function GameScript(scriptData){

    if (scriptData == undefined) throw new Error("Script mus have a scriptfile")

    var state = {
        scriptData:scriptData, // need to open the script 
        scriptChapter:0,
        chapterPage:0
    }

    // chapter functions

    let getChapter = function getChapter(chapterName = getChapterName()){
        if(hasChapter(chapterName)){
            return scriptData[chapterName]
        }else{
            throw new Error(`Named chapter not found: ${chapterName}`)
        }
    }

    let hasChapter = function hasChapter(chapterName){
        return Object.keys(scriptData).includes(chapterName)
    }

    let getChapterName = function getChapterName(chapterIndex = state.scriptChapter){
        return Object.keys(scriptData)[chapterIndex];
    }

    let getChapters = function getScript(){
        return Object.keys(state.scriptData)
    }

    let nextChapter = function nextChapter(){
        if(state.scriptChapter < getChapters().length -1){
            state.scriptChapter ++;
            state.chapterPage = 0;
            return getChapters()[state.scriptChapter] // return chapter name
        }else{
            throw new Error("End of chapters")
        }
    }

    let prevChapter = function prevChapter(){
        if(state.scriptChapter > 0){
            state.scriptChapter --;   // lower the chapter
            state.chapterPage = 0   // go to first page of chapter
            return getChapters()[state.scriptChapter]
        }else{
            throw new Error("Start of chapters")
        }
    }

    // page functions

    let nextPage = function nextPage(){
        let thisChapter = getChapterName()
        // if there are pages left
        if(chapterPage+1 < scriptData[thisChapter].length){
            chapterPage ++;
        }else{  
            nextChapter()
        }

        // return the page text
        return getPage();
    }

    let prevPage = function prevPage(){
        
    }

    let getPage = function getPage(chapterPage = state.chapterPage){
        
        let activeChapter = getChapter();

        // check page numbers
        if(chapterPage < 0) throw new Error("Chapter can't be less than 0")
        if(chapterPage >= activeChapter.length) throw new Error(`chapterPage too high: ${chapterPage} of ${activeChapter.length}`)
        

        return getChapter()[chapterPage]
    }

    // TODO: Check for unmet interaction test

    return Object.assign(
        {
            getChapters,
            getChapter,
            getChapterName,
            nextChapter,
            prevChapter,
            getPage,
            nextPage,
            prevPage,
            hasChapter
        },
        behaviours.stateReporter(state)

    )


}

module.exports = GameScript