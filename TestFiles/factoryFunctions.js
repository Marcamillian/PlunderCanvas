const dog = function dog(){
    const sound = "woof"
    return{
        talk:function talk(){
            console.log(sound);
        }
    }
}

const sniffles = dog();

sniffles.talk()