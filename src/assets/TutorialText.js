
 const TutorialScript = {
    intro:[
        {
            text: "The core of this game is using the effects of gravity to discover hidden treasure and hide your own"
        },
        {
            text: "Your ship can fire a probe into a field of satellites"
        },
        {
            text: "The probe will be attracted to satellites with treasure on"
        },
        {
            text: " ## scirpt to show the satellite affected by treasure"
        },
        {
            text:"Unfortunately there is a competitor in your hunt for treasure"
        },
        {
           text:  " ## script to show other ship",
        },
        {
            text: "Satellites will show the amount of treasure you have placed on them"
        },
        {
            text: "But you will have to use gravity to discover where your opponent has hidden theirs"
        },
        { 
            text:" ## script to show 0 treasure satellite affecting probe"
        }
    ],
    Basic_Controls:[
        { 
            text: "Click on the field to aim the probe then click the fire button to release a probe"
        },
        { 
            text: " ** interactive section - ends with a probe being fired"

        },
    ],
    
    Treasure_Guess:[
        { 
            text: "Fire a probe in order and see which satellite has hidden treasure"

        },
        { 
            text: "Click the guess button and then the satellite to guess"

        },
        { 
            text: " ** incorrect guess - treasure is moved?"

        },
        { 
            text: " ** interaction ends when the correct satellite is selected"

        }
    ],
    Own_Treasure:[
        { 
            text: "The probe is also affected by your treasure (visible to you)"


        },
        { 
            text: "Try to compensate for your treasure while finding out which of the back satellites holds opponent treasure"


        },
        { 
            text: " ** Interaction ends when the correct satellite is selected"


        }
    ],
    Stacked_Treasure:[
        { 
            text: "Satellites can hold treasure from you AND your opponent"
        },
        { 
            text: "The probe is affected by the gravity of both totals combined"
        },
        { 
            text: "In the last challenge your opponent has placed treasure on the same satellite as you"
        },
        { 
            text: "Use the probe to investigate which of the satellites carries opponent treasure as well as your own"
        },
        { 
            text: " ** interaction ends "
        },
        
    ]
}

module.exports = TutorialScript