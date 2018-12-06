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

    let getChapterByIndex = function getChapterByIndex(chapterIndex){
        
        if(chapterIndex == undefined) throw new Error("no chapter index entered")

        if(chapterIndex >=0 && chapterIndex < state.scriptChapters.length){
            return state.scriptChapters[chapterIndex]
        }else{
            throw new Error(`${state.scriptChapters.length} chapters in script. Can't find chapter ${chapterIndex}`)
        }

    }

    let getCurentChapter = function getCurrentChapter(){
        return scriptChapters[currentChapterIndex]
    }

    let hasChapterName = function hasChapterName(chapterName){
        return state.scriptChapters.map(chapter => chapter.name).includes(chapterName)
    }

    let getChapterName = function getChapterName(chapterIndex = state.currentChapterIndex){
        return state.scriptChapters[chapterIndex].name;
    }

    let getChapters = function getScript(){
        return state.scriptChapters
    }

    let nextChapter = function nextChapter(){
        if(state.currentChapterIndex < getChapters().length -1){
            state.currentChapterIndex ++;
            state.chapterPage = 0;
            return getChapterByIndex(state.currentChapterIndex) // return chapter name
        }else{
            throw new Error("End of chapters")
        }
    }

    let prevChapter = function prevChapter(){

        if(state.currentChapterIndex > 0){
            state.currentChapterIndex --;   // lower the chapter
            return getChapterByIndex(state.currentChapterIndex)
        }else{
            throw new Error("Start of chapters")
        }
    }

    // page functions

    let pageForward = function pageForward(pagesToProgress = 1){

        let currentChapterLength = getChapterByIndex(state.currentChapterIndex).pages.length;

        // if there are pages left
        if(state.chapterPage + (pagesToProgress) < currentChapterLength){

            state.chapterPage += pagesToProgress;
        }else{  

            let remainingPagesInChapter = getChapterByIndex(state.currentChapterIndex).pages.length - state.chapterPage;
            let remainingPages = pagesToProgress - remainingPagesInChapter;
            nextChapter()
            pageForward(remainingPages)
        }

        // return the page text
        return getPage();
    }

    let pageBackward = function pageBackward(pagesToBackUp = 1){

        // if there are pages left
        if(state.chapterPage - pagesToBackUp >= 0){
            state.chapterPage -= pagesToBackUp;
        }else{
            // how many pages to back up after getting out of current chapter 
            let remainingPagesToBackUp = pagesToBackUp - state.chapterPage;

            // go to previous chapter
            try{
                prevChapter()
                // backed up a page by switching chapters
                remainingPagesToBackUp -= 1
                // set page to the last page of prev chapter
                state.chapterPage = state.scriptChapters[state.currentChapterIndex].pages.length -1;
                // back up any remaining pages
                pageBackward(remainingPagesToBackUp)
            }catch(e){
                if(/Start of chapters/i.test(e.message)){
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
        
        let activeChapter = getChapterByIndex(state.currentChapterIndex);

        // check page numbers
        if(chapterPage < 0) throw new Error("Chapter can't be less than 0")
        if(chapterPage >= activeChapter.length) throw new Error(`chapterPage too high: ${chapterPage} of ${activeChapter.length}`)
        

        return activeChapter.pages[chapterPage]
    }

    // TODO: Check for unmet interaction test

    return Object.assign(
        {
            getChapters,
            getChapterByName,
            getChapterByIndex,
            getChapterName,
            nextChapter,
            prevChapter,
            getPage,
            pageForward,
            pageBackward,
            hasChapterName
        },
        behaviours.stateReporter(state)

    )


}

module.exports = GameScript