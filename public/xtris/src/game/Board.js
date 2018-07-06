import * as constants from "./constants.js";

class Board{
    constructor() {
        this.grid = []
        
        //Initialize the grid
        for (let r=0; r<constants.BOARD_HEIGHT; r++){
            this.addRow();
        }
    }
    
    addRow(){
        var row = [];
        for(let c=0; c<constants.BOARD_WIDTH; c++){
            row.push(0);
        }
        this.grid.unshift(row);
    }
    
    asArray(){
        return this.grid;
    }
    
    canPlaceBlock(block, position){
        let posX = position[0];
        let posY = position[1];
        for(let y=0; y<block.length; y++){
            for(let x=0; x<block[0].length; x++){
                let leftOff = (x + posX) < 0,
                    rightOff = (x + posX) >= constants.BOARD_WIDTH,
                    bottomOff = (y + posY) >= constants.BOARD_HEIGHT;
                if(block[y][x] !== 0 &&
                   (leftOff || rightOff || bottomOff || this.grid[posY+y][posX+x] !== 0)){
                    return false;
                }
            }
        }
        return true;
    }
    
    placeBlockAndCheckLines(block, position){
        let posX = position[0];
        let posY = position[1];
        let fullLines = [];
        
        for(let y=0; y<block.length; y++){
            for(let x=0; x<block[0].length; x++){
                if(block[y][x] !== 0){
                    this.grid[posY+y][posX+x] = block[y][x];
                }
            }
            if(this.isLineFull(posY + y)){
                fullLines.push(posY + y);
            }
        }
        
        this.removeLines(fullLines);
        return fullLines.length;
    }
    
    isLineFull(y){
        if(y < 0 || y >= this.grid.length){
            return false;
        }
        
        for(let x=0; x<constants.BOARD_WIDTH; x++){
            if(this.grid[y][x] === 0){
                return false;
            }
        }
        return true;
    }
    
    removeLines(lines){
        for(let i=0; i<lines.length; i++){
            this.grid.splice(lines[i], 1);
            this.addRow();
        }
    }
}

export default Board
