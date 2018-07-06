import * as constants from "./constants"

import TetrisGame from "./Game.js";
import Graphics from "./Graphics.js";
import Controls from "./Controls.js";

class GameRunner {
    constructor(canvas, game){
        this.game = game || new TetrisGame();
        this.graphics = new Graphics(canvas);
        this.controls = new Controls();
        
        this.elapsed = 0;
        this.previousAction = null;
        this.moveDelay = 0;
        this.dropDelay = 0;
        
        this.shouldMoveLeft = false;
        this.shouldMoveRight = false;
        this.shouldRotateLeft = false;
        this.shouldRotateRight = false;
        this.shouldDropDown = false;
    }
    
    processTick(delta){
        let tickDelta = Math.max(constants.LEVEL_TICK_TIME_BASELINE - constants.LEVEL_TICK_TIME_DECREMENT*this.game.getLevel(), 50);
        console.log("tickDelta: " + tickDelta, "delta:", delta);
        this.elapsed += delta;
        if(this.elapsed > tickDelta){
            this.elapsed = this.elapsed % tickDelta;
            this.game.moveDown();
        }
    }
    
    processControls(delta){
        this.moveDelay -= delta;
        this.dropDelay -= delta;

        if(this.controls.wasKeyPressed(37) || this.shouldMoveLeft){
            this.game.moveLeft();
            this.moveDelay = 100;
            this.previousAction = "left";
        }
        
        if(this.controls.wasKeyPressed(39) || this.shouldMoveRight){
            this.game.moveRight();
            this.moveDelay = 100;
            this.previousAction = "right";
        }
        
        if(this.controls.wasKeyPressed(40)){
            this.game.moveDown();
            this.elapsed = 0;
            this.dropDelay = 100;
            this.previousAction = "down";
        }
        
        if(this.controls.wasKeyPressed(38) || this.shouldRotateRight){
            this.game.rotateRight();
        }
        
        if(this.shouldRotateLeft){
            this.game.rotateLeft();
        }
        //if(controls.isKeyDown(32) && (previousAction !== "drop" || dropDelay <= 0)){
        if(this.controls.wasKeyPressed(32) || this.shouldDropDown){
            this.game.dropDown();
            this.dropDelay = 500;
            this.previousAction = "drop";
        }
        
        this.shouldMoveLeft = false;
        this.shouldMoveRight = false;
        this.shouldRotateLeft = false;
        this.shouldRotateRight = false;
        this.shouldDropDown = false;
        
        this.controls.clear();
    }
    
    loop(delta){
        console.log("delta", delta)
        this.processTick(delta);
        this.processControls(delta);
        this.graphics.drawGame(this.game);
    }
    
    moveLeft(){this.shouldMoveLeft = true;}
    moveRight(){this.shouldMoveRight = true;}
    rotateLeft(){this.shouldRotateLeft = true;}
    rotateRight(){this.shouldRotateRight = true;}
    dropDown(){this.shouldDropDown = true;}
    
    run(){
        console.log("this:");
        console.log(this);
        let cancelled = false,
            handle = null,
            previous = null;
        
        let f = (time) => {
            if(previous === null){
                previous = time;
            }
            let delta = time - previous;
            previous = time;
            this.loop(delta);
            if(!cancelled){
                handle = requestAnimationFrame(f);
            }
        };
        handle = requestAnimationFrame(f);
        
        this.game.onGameOver = (score) => {
            console.log("cancelling frame: "+handle);
            cancelAnimationFrame(handle);
            cancelled = true;
            if(window.confirm("Want to play again?")){
                this.controls = new Controls();
                this.game = new TetrisGame();
                previous = null;
                this.elapsed = 0;
                this.run();
            }
        }
    }
}

export default GameRunner
