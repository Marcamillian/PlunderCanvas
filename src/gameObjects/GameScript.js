behaviours = require('./../behaviours.js');

const GameScript = function GameScript({chapters}){

    if (chapters == undefined) throw new Error("Script mus have a scriptfile")

    var state = {
        scriptChapters:chapters, // need to open the script 
        currentChapterIndex:0,
        chapterPage:0
    }

    // chapter functions

    let getChapterByName = function getChapterByName(chapterName){

        if(chapterName == undefined) throw new Error("no chapter name entered")

        if(hasChapterName(chapterName)){
            return state.scriptChapters.find(chapter => chapter.name == chapterName)
        }else{
            throw new Error(`Named chapter not found: ${chapterName}`)
        }
    }

    let getCurentChapter = function getCurrentChapter(){
        return scriptChapters[currentChapterIndex]
    }

    let hasChapterName = function hasChapterName(chapterName){
        // how search new array by name for chapters
        // array.filter on chapter name
        // OR array.map then includes
        return state.scriptChapters.map(chapter => chapter.name).includes(chapterName)
    }

    let getChapterName = function getChapterName(chapterIndex = state.currentChapterIndex){
        return Object.keys(state.scriptChapters)[chapterIndex];
    }

    let getChapters = function getScript(){
        return state.scriptChapters
    }

    let nextChapter = function nextChapter(){
        if(state.currentChapterIndex < getChapters().length -1){
            state.currentChapterIndex ++;
            state.chapterPage = 0;
            return getChapters()[state.currentChapterIndex] // return chapter name
        }else{
            throw new Error("End of chapters")
        }
    }

    let prevChapter = function prevChapter(){
        if(state.currentChapterIndex > 0){
            state.currentChapterIndex --;   // lower the chapter
            state.chapterPage = 0   // go to first page of chapter
            return getChapters()[state.scriptChapter]
        }else{
            throw new Error("Start of chapters")
        }
    }

    // page functions

    let nextPage = function nextPage(pagesToProgress = 1){
        let thisChapter = getChapterName()
        // if there are pages left
        if(state.chapterPage + (pagesToProgress-1) <= state.currentChapterIndex[thisChapter].length){
            state.chapterPage += pagesToProgress;
        }else{  
           nextChapter()
        }

        // return the page text
        return getPage();
    }

    let prevPage = function prevPage(pagesToBackUp = 1){
        // if there are pages left
        if(state.chapterPage - pagesToBackUp >= 0){
            state.chapterPage -= pagesToBackUp;
        }else{ 
            try{
                prevChapter()
            } catch(e){
                if (/Start of chapters/i.test(e.message)){
                    throw new Error("First page of script")
                }else{
                    throw e
                }
            }
        }

        // return the page text
        return getPage();
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
            getChapterByName,
            getChapterName,
            nextChapter,
            prevChapter,
            getPage,
            nextPage,
            prevPage,
            hasChapterName
        },
        behaviours.stateReporter(state)

    )


}

module.exports = GameScript