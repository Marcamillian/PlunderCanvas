test = require('tape');
GameScript = require('./../src/gameObjects/GameScript');

const scriptData = {
    "chapter1":[
        "Something here",
        "Something else",
        "Aditional thing"
    ],
    "chapter2":[
        "second something",
        "another something here",
        "additonal something 2"
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
