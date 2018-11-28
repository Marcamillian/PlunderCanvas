test = require('tape');
GameScript = require('./../src/gameObjects/GameScript');

const scriptData = {
    "chapter1":[
        {text:"Something here"},
        {text:"Something else"},
        {text:"Aditional thing"}
    ],
    "chapter2":[
        {text:"second something"},
        {text:"another something here"},
        {text:"additonal something 2"}
    ]
}

test("Testing GameScript creation ", (t)=>{
    
    let gameScript = GameScript(scriptData);

    let chapters = gameScript.getChapters();

    t.equals(chapters.length, 2, "Two chapters in script");
    t.equals(chapters[0], "chapter1", "Correct name of chapter 1")

    t.end()
})

test("Testing getters", (t)=>{

    let testScript = GameScript(scriptData);
    var result;

    // get current chapter
    t.equals(testScript.getChapter(), scriptData['chapter1'], "getChapter defaults to first chapter")
    
    t.equals(testScript.getChapter("chapter2"), scriptData['chapter2'], "getChapterByName working correctly");

    t.throws(()=>{testScript.getChapter('something unknown'), /Named chapter not found/i, "Throw errror on none found"})

    // get current chapter name
    t.equals(testScript.getChapterName(), "chapter1", "");


    t.end()
})

test("Testing chapter present in GameScript", (t)=>{
    let testScript = GameScript(scriptData);

    t.equals(testScript.hasChapter(Object.keys(scriptData)[1]), true, "Chapter correctly identified");
    t.equals(testScript.hasChapter("Wrong Chapter"), false, "Doesn't have the chapter")
    t.equals(testScript.hasChapter(), false, "No chapter given to check") // ?? should this return an error or false // funfunfunction forum question

    t.end()
})

test("Testing chapter changing", (t)=>{

    let testScript = GameScript(scriptData);
    let chapterNames = Object.keys(scriptData);

    t.equals(testScript.nextChapter(), chapterNames[1], "Next chapter provided on chapter change")
    t.throws(()=>{testScript.nextChapter()}, /End of chapters/i, "Can't go further than last chapter") 
    t.equals(testScript.prevChapter(), chapterNames[0], "Previous chapter is correct")
    t.throws(()=>{testScript.prevChapter()}, /Start of chapters/i, "Can't go before first chapter")
    
    t.end()
})

test("Testing page changing",(t)=>{


    let testScript = GameScript(scriptData);
    // !!TODO : Test the page changing functionality
    // advance a page
    

    // back up a page

    // back up a page ()

    // -- advance to chapter end

    // advance over chapter boundary

    //

    t.end()
})

test("Testing page get", (t)=>{
    let testScript = GameScript(scriptData);

    var chapterNames = Object.keys(scriptData)
    var afterLastPage = testScript.getChapter().length;

    // default get page
    t.equals(testScript.getPage(), scriptData[chapterNames[0]][0], "Gets the first page of first chapter")

    // try a page less than 1
    t.throws(()=>{ testScript.getPage(-1) },/Chapter can't be less than 0/i, "getPage less than 0" );

    // try get a different page
    t.equals( testScript.getPage(2), scriptData[chapterNames[0]][2], "Gets a non default page in the chapter")

    // try an out of upper range page
    t.throws( ()=>{ testScript.getPage(afterLastPage) }, /chapterPage too high/i , "Error thrown if found a page out of range" )

    t.end()
})
