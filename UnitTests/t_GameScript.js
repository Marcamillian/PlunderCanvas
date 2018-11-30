test = require('tape');
GameScript = require('./../src/gameObjects/GameScript');

const scriptData = {
	"chapters": [
		{
			"name": "chapter1",
			"pages": [{
					"text": "Click on the field to aim the probe then click the fire button to release a probe"
				},
				{
					"text": " ** interactive section - ends with a probe being fired"
				}
			]
		},
		{
			"name": "chapter2",
			"pages": [{
					"text": "The probe is also affected by your treasure (visible to you)"
				},
				{
					"text": "Try to compensate for your treasure while finding out which of the back satellites holds opponent treasure"
				},
				{
					"text": " ** Interaction ends when the correct satellite is selected"
				}
			]
		}
	]
}

test("Testing GameScript creation ", (t)=>{
    
    let gameScript = GameScript(scriptData);

    let chapters = gameScript.getChapters();
    let chapterNames = Object.values(scriptData.chapters).map(chapter => chapter.name)

    t.equals(chapters.length, 2, "Two chapters in script");
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

test.skip("Testing chapter present in GameScript", (t)=>{
    let testScript = GameScript(scriptData);

    t.equals(testScript.hasChapter(Object.keys(scriptData)[1]), true, "Chapter correctly identified");
    t.equals(testScript.hasChapter("Wrong Chapter"), false, "Doesn't have the chapter")
    t.equals(testScript.hasChapter(), false, "No chapter given to check") // ?? should this return an error or false // funfunfunction forum question

    t.end()
})

test.skip("Testing chapter changing", (t)=>{

    let testScript = GameScript(scriptData);
    let chapterNames = Object.keys(scriptData);

    t.equals(testScript.nextChapter(), chapterNames[1], "Next chapter provided on chapter change")
    t.throws(()=>{testScript.nextChapter()}, /End of chapters/i, "Can't go further than last chapter") 
    t.equals(testScript.prevChapter(), chapterNames[0], "Previous chapter is correct")
    t.throws(()=>{testScript.prevChapter()}, /Start of chapters/i, "Can't go before first chapter")
    
    t.end()
})

test.skip("Testing page changing",(t)=>{


    let testScript = GameScript(scriptData);
    let chapterNames = Object.keys(scriptData);
    chapterLengths = scriptData.map( chapter.length ) 


    t.test(testScript.getPage(), scriptData[chapterNames[0]][0], "Start on first page")
    // !!TODO : Test the page changing functionality
    // advance a page
    t.test(testScript.nextPage(), scriptData[chapterNames[0]][1], "Returns the next page")

    t.test(testScript.getPage(), scriptData[chapterNames[0]][1], "Really are on the previous page")

    // back up a page
    t.test(testScript.prevPage(), scriptData[chapterNames[0]][0], "Previous page")

    // try to back up past first page
    t.throws(()=>{testScript.prevPage()}, /First page of script/i, "Trying to back up past first page of script")

    // -- advance pages to chapter end
    t.test(testScript)
    

    // advance over chapter boundary

    //

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
