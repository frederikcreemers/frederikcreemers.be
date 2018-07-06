import * as constants from "./constants.js";

import Board from "./Board.js";
import BlockManager from "./BlockManager.js";
import BlockPositionManager from "./BlockPositionManager.js";
import ScoreManager from "./ScoreManager";

class Game {
    constructor() {
        this.board = new Board();
        this.blockManager = new BlockManager();
        this.blockPositionManager = new BlockPositionManager(this.blockManager.getCurrentBlock());
        this.scoreManager = new ScoreManager();

        this.onGameOver = function(score){};
        
        this.moveLeft = this.moveBlock.bind(this, constants.LEFT);
        this.moveRight = this.moveBlock.bind(this, constants.RIGHT);
        
        this.getLevel = () => this.scoreManager.getLevel();
        this.getScore = () => this.scoreManager.getScore();
        this.getLines = () => this.scoreManager.getLines();
        this.getBoard = () => this.board.asArray();
        this.getCurrentBlock = () => this.blockManager.getCurrentBlock();
        this.getNextBlock = () => this.blockManager.getNextBlock();
        this.getBlockPosition = () => this.blockPositionManager.getPosition();
    }
    
    moveBlock(direction){
        let newPosition = this.blockPositionManager.getRelativePosition(direction);
        if(!this.board.canPlaceBlock(this.blockManager.getCurrentBlock(), newPosition)){
            return false;
        }
        this.blockPositionManager.moveBlock(direction);
        return true;
    }
    
    moveDown(){
        if(!this.moveBlock(constants.DOWN)){
            let lines = this.board.placeBlockAndCheckLines(this.blockManager.getCurrentBlock(), this.blockPositionManager.getPosition());
            this.scoreManager.updateWithLines(lines);
            this.blockManager.nextBlock();
            this.blockPositionManager.setInitialPosition(this.blockManager.getCurrentBlock());
            
            let block = this.blockManager.getCurrentBlock();
            let position = this.blockPositionManager.getPosition();
            
            if(!this.board.canPlaceBlock(block, position)){
                this.onGameOver();
            }
            return false;
        }
        return true;
    }
    
    rotateLeft(){
        let offsets = this.blockManager.rotateLeft();
        let currentBlock = this.blockManager.getCurrentBlock();
        
        for(let i=0; i<offsets.length; i++){
            let offset = offsets[i];
            let position = this.blockPositionManager.getRelativePosition(offset);
            if(this.board.canPlaceBlock(currentBlock, position)){
                this.blockPositionManager.moveRelative(offset);
                return true;
            }
        }
        this.blockManager.rotateRight();
        return false;
    }
    
    rotateRight(){
        let offsets = this.blockManager.rotateRight();
        let currentBlock = this.blockManager.getCurrentBlock();
        
        for(let i=0; i<offsets.length;i++){
            let offset = offsets[i];
            let position = this.blockPositionManager.getRelativePosition(offset);
            if(this.board.canPlaceBlock(currentBlock, position)){
                this.blockPositionManager.moveRelative(offset);
                return true;
            }
        }
        this.blockManager.rotateLeft();
        return false;
    }
    
    dropDown(){
        while(this.moveDown()){
            continue;
        }
    }
    
    getGhostPosition(){
        let block = this.blockManager.getCurrentBlock();
        let position = this.blockPositionManager.getPosition();
        let y = position[1];
        while(this.board.canPlaceBlock(block, [position[0], y])){
            y += 1;
        }
        return [position[0], y-1];
    }
}

export default Game
