class Controls{
    constructor() {
        this.currentlyDown = [];
        for(let i=0;i<256;i++){
            this.currentlyDown.push(false);
        }
        
        this.clear();
        window.addEventListener("keydown", this.handleEvent.bind(this));
        window.addEventListener("keyup", this.handleEvent.bind(this));
    }

    clear(){
        this.releasedThisTick = [];
        this.pressedThisTick = [];
    };

    isKeyDown(keyCode){
        return this.currentlyDown[keyCode] || this.releasedThisTick.indexOf(keyCode) >= 0;
    };

    wasKeyPressed(keyCode){
        return this.pressedThisTick.indexOf(keyCode) >= 0;
    }

    handleEvent(event){
            this.currentlyDown[event.keyCode] = (event.type === "keydown");
            if(event.type === "keyup"){
                this.releasedThisTick.push(event.keyCode);
            }
            if(event.type === "keydown"){
                this.pressedThisTick.push(event.keyCode);
            }
    }
}

export default Controls