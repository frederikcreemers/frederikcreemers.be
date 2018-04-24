define(function(){

    var controls = function(){
        this.currentlyDown = [];
        for(var i=0;i<256;i++){
            this.currentlyDown.push(false);
        }
        console.log("initialized currentlyDown");
        console.log(this.currentlyDown);

        this.clear = function(){
            this.releasedThisTick = [];
            this.pressedThisTick = [];
        };
        this.clear();

        this.isKeyDown = function(keyCode){
            return this.currentlyDown[keyCode] || this.releasedThisTick.indexOf(keyCode) >= 0;
        };

        this.wasKeyPressed = function(keyCode){
            return this.pressedThisTick.indexOf(keyCode) >= 0;
        };

        var self = this;
        var listener = function(event){
            self.currentlyDown[event.keyCode] = (event.type === "keydown");
            if(event.type === "keyup"){
                self.releasedThisTick.push(event.keyCode);
            }
            if(event.type === "keydown"){
                self.pressedThisTick.push(event.keyCode);
            }
        };

        window.addEventListener("keydown", listener);
        window.addEventListener("keyup", listener);
    };

    return controls;
});
