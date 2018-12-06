test = require('tape');
GameScript = require('./../src/gameObjects/GameScript');

const scriptData = {
	"chapters": [
		{
			"name": "chapter1",
			"pages": [
                { "text": "Click on the field to aim the probe then click the fire button to release a probe" },
				{ "text": " ** interactive section - ends with a probe being fired" }
			]
		},
		{
			"name": "chapter2",
			"pages": [
                { "text": "The probe is also affected by your treasure (visible to you)"},
				{ "text": "Try to compensate for your treasure while finding out which of the back satellites holds opponent treasure"},
				{ "text": " ** Interaction ends when the correct satellite is selected"}
			]
        },
        {
            "name":"chapter3",
            "pages":[
                {"text": "Something that the tutorial should say"},
                {"text": "Additional thing that the tutorial is expected to say"},
                {"text" : "Last thing that is expected of the tutorial"}
            ]
        }
	]
}

// !! TODO - was adding another chapter to test crossing 2 chapter boundaries

test("Testing GameScript creation ", (t)=>{
    
    let gameScript = GameScript(scriptData);

    let chapters = gameScript.getChapters();
    let chapterNames = Object.values(scriptData.chapters).map(chapter => chapter.name)

    t.equals(chapters.length, scriptData.chapters.length, "Correct number of chapters in script");
    t.equals(chapters[0].name, chapterNames[0], "Correct name of chapter 1")

    t.end()
})

test("Testing hasChapter", (t)=>{
    let gameScript = GameScript(scriptData);

    t.test(gameScript.hasChapterName("chapter1"), true, "Positive identification of chapter name")
    t.test(gameScript.hasChapterName("chapter1555"), true, "Negative identificaion of chapter name")

    t.end()
})

test("Testing gatChapterByName", (t)=>{

    let testScript = GameScript(scriptData);
    let chapterNames = Object.values(scriptData.chapters).map( chapter => chapter.name);
    var result;

    t.throws(()=>{ testScript.getChapterByName()}, /no chapter name entered/i, "No argument - provide chapterName error")
    
    t.equals(testScript.getChapterByName(chapterNames[0]), scriptData.chapters[0], "getChapterByName working correctly");

    t.throws(()=>{testScript.getChapterByName('something unknown'), /Named chapter not found/i, "Throw errror on none found"})

    t.end()
})

test("Testing get chapterByIndex", (t)=>{
    let testScript = GameScript(scriptData);

    t.test(testScript.getChapterByIndex(0), scriptData.chapters[0], "Gets the first chapter")

    t.throws(()=>{testScript.getChapterByIndex(15)}, /chapters in script. Can't find chapter/i, "Throws on index out of top range")

    t.throws(()=>{testScript.getChapterByIndex(-45)}, /chapters in script. Can't find chapter/i, "Throws on index out of bottom range")


    t.end()
})

test("Testing chapter present in GameScript", (t)=>{
    let testScript = GameScript(scriptData);
    let chapterNames = scriptData.chapters.map(chapter => chapter.name)

    t.equals(testScript.hasChapterName(chapterNames[1]), true, "Chapter correctly identified");
    t.equals(testScript.hasChapterName("Wrong Chapter"), false, "Doesn't have the chapter")
    t.equals(testScript.hasChapterName(), false, "No chapter given to check") // ?? should this return an error or false // funfunfunction forum question

    t.end()
})

test("Testing chapter changing", (t)=>{

    let testScript = GameScript(scriptData);
    let chapterNames = scriptData.chapters.map( chapter => chapter.name)
    let numberOfChapters = scriptData.chapters.length;
    var chaptersTillEnd;

    t.throws(()=>{testScript.prevChapter()}, /Start of chapters/i, "Can't go before first chapter")

    t.equals(testScript.nextChapter(), scriptData.chapters[1], "Next chapter provided on chapter change")
   
    // proceed to end of chapters
    chaptersTillEnd = (numberOfChapters - 1) - testScript.getCurrentChapterIndex()
    for ( i = 0; i < chaptersTillEnd; i++ ){
        testScript.nextChapter()
    }

    // check that we can't go further than this
    t.throws(()=>{testScript.nextChapter()}, /End of chapters/i, "Can't go further than last chapter") 

    // check that we can go back a chapter
    t.equals(testScript.prevChapter(), scriptData.chapters[numberOfChapters -1 -1],"Previous chapter is correct")
    
    
    t.end()
})

test("Testing page changing",(t)=>{

    let testScript = GameScript(scriptData);
    let chapterNames = scriptData.chapters.map( chapter => chapter.name);
    chapterLengths = scriptData.chapters.map( chapter => chapter.pages.length );

    t.equals(testScript.getPage(), scriptData.chapters[0].pages[0], "Start on first page")
    
    // advance a page
    t.equals(testScript.pageForward(), scriptData.chapters[0].pages[1], "Returns the next page")
    t.equals(testScript.getPage(), scriptData.chapters[0].pages[1], "Really are on the next page")

    // back up a page
    t.equals(testScript.pageBackward(), scriptData.chapters[0].pages[0], "Previous page")
    t.equals(testScript.getPage(), scriptData.chapters[0].pages[0], "Really are on the previous page")

    // try to back up past first page
    t.throws(()=>{testScript.pageBackward()}, /First page of script/i, "Trying to back up past first page of script")

    // -- advance pages to chapter end
    t.equals(testScript.pageForward(chapterLengths[0] -1 ), scriptData.chapters[0].pages[ chapterLengths[0]-1 ], "Advance multiple pages (to end)" )
    t.equals( testScript.getPage(), scriptData.chapters[0].pages[chapterLengths[0]-1], "Really are at the end page" );

    // advance over chapter boundary
    t.equals(testScript.pageForward(), scriptData.chapters[1].pages[0], "Advance over chapter boundary");
    t.equals( testScript.getPage(), scriptData.chapters[1].pages[0], "Really are on first page of next chapter")

    // reverse over chapter boundary
    t.equals( testScript.pageBackward(), scriptData.chapters[0].pages[chapterLengths[0]-1], "On last page of the first chapter")
    t.equals( testScript.getPage(), scriptData.chapters[0].pages[chapterLengths[0]-1], "Really are on the last page of the first chapter")

    // advance over page boundary by more than one
    t.equals(testScript.pageForward(2), scriptData.chapters[1].pages[1], "Can advance over page boundary by more than one");
    t.equals( testScript.getPage(), scriptData.chapters[1].pages[1], "really are on the first page second chapter")

    // back up over page boundary by more than one
    t.equals(testScript.pageBackward(3), scriptData.chapters[0].pages[chapterLengths[0]-2], "Backe up over page boundary by more than one");
    t.equals(testScript.getPage(), scriptData.chapters[0].pages[chapterLengths[0]-2], "Really are on the second to last page")

    t.end()
})

test.skip("Testing page get", (t)=>{
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
