
 const TutorialScript = {
    intro:[
        "The core of this game is using the effects of gravity to discover hidden treasure and hide your own",
        "Your ship can fire a probe into a field of satellites",
        "The probe will be attracted to satellites with treasure on",
        " ## scirpt to show the satellite affected by treasure",
        "Unfortunately there is a competitor in your hunt for treasure",
        " ## script to show other ship",
        "Satellites will show the amount of treasure you have placed on them",
        "But you will have to use gravity to discover where your opponent has hidden theirs",
        " ## script to show 0 treasure satellite affecting probe"
    ],
    Basic_Controls:[
        "Click on the field to aim the probe then click the fire button to release a probe",
        " ** interactive section - ends with a probe being fired"
    ],
    
    Treasure_Guess:[
        "Fire a probe in order and see which satellite has hidden treasure",
        "Click the guess button and then the satellite to guess",
        " ** incorrect guess - treasure is moved?",
        " ** interaction ends when the correct satellite is selected"
    ],
    Own_Treasure:[
        "The probe is also affected by your treasure (visible to you)",
        "Try to compensate for your treasure while finding out which of the back satellites holds opponent treasure",
        " ** Interaction ends when the correct satellite is selected"
    ],
    Stacked_Treasure:[
        "Satellites can hold treasure from you AND your opponent",
        "The probe is affected by the gravity of both totals combined",
        "In the last challenge your opponent has placed treasure on the same satellite as you",
        "Use the probe to investigate which of the satellites carries opponent treasure as well as your own",
        " ** interaction ends "
    ]
}

module.exports = TutorialScript