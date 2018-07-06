define(["tetrisGame", "graphics", "controls", "constants"], function(TetrisGame, Graphics, Controls, constants){
    var game = new TetrisGame();
    var graphics = new Graphics();
    var elapsed = 0;

    var processTick = function(delta){
        var tickMultiplier = Math.pow(constants.LEVEL_TICK_TIME_MULTIPLIER, game.getLevel());
        var tickDelta = constants.LEVEL_TICK_TIME_BASELINE * tickMultiplier;
        elapsed += delta;
        if(elapsed > tickDelta){
            console.log("process tick: "+tickDelta+", "+ game.getLevel());
            elapsed = elapsed % tickDelta;
            game.moveDown();
        }
    };

    var controls = new Controls();
    var previousAction = null;
    var moveDelay = 0;
    var dropDelay = 0;
    var processControls = function(delta){
        moveDelay -= delta;
        dropDelay -= delta;
        //if(controls.isKeyDown(37) && (previousAction !== "left" || moveDelay <= 0)){
        if(controls.wasKeyPressed(37)){
            game.moveLeft();
            moveDelay = 100;
            previousAction = "left";
        }
        //if(controls.isKeyDown(39) && (previousAction !== "right" || moveDelay <= 0)){
        if(controls.wasKeyPressed(39)){
            game.moveRight();
            moveDelay = 100;
            previousAction = "right";
        }
        //if(controls.isKeyDown(40) && (previousAction !== "down" || dropDelay <= 0)){
        if(controls.wasKeyPressed(40)){
            game.moveDown();
            dropDelay = 100;
            previousAction = "down";
        }
        if(controls.wasKeyPressed(38)){
            game.rotateRight();
        }
        //if(controls.isKeyDown(32) && (previousAction !== "drop" || dropDelay <= 0)){
        if(controls.wasKeyPressed(32)){
            game.dropDown();
            dropDelay = 500;
            previousAction = "drop";
        }
        controls.clear();
    };

    var runLoop = function(delta){
        processTick(delta);
        processControls(delta);
        graphics.drawGame(game);
    };

    return {
        run: function(){
            var cancelled = false;
            var handle;
            var previous = null;
            var f = function(time){
                if(previous === null){
                    previous = time;
                }
                delta = time - previous;
                previous = time;
                runLoop(delta);
                if(!cancelled){
                    handle = requestAnimationFrame(f);
                }
            };
            handle = requestAnimationFrame(f);
            var self = this;

            game.onGameOver = function(score){
                console.log("cancelling frame: "+handle);
                cancelAnimationFrame(handle);
                cancelled = true;
                if(confirm("Helaas, het spel is afgelopen.\nWil je opnieuw spelen?")){
                    controls = new Controls();
                    game = new TetrisGame();
                    previous = null;
                    elapsed = 0;
                    self.run();
                }
            };
        }
    };


});
