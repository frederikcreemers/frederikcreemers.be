import * as constants from "./constants.js";

class BlockPositionManager {
    constructor(block){
        this.positionMapping = {
            [constants.LEFT]: [-1, 0],
            [constants.RIGHT]: [1, 0],
            [constants.DOWN]: [0, 1]
        }
        this.setInitialPosition(block);
    }
    
    setInitialPosition(block){
        let blockWidth = block[0].length;
        let startX = Math.floor((constants.BOARD_WIDTH - blockWidth) / 2);
        this.position = [startX, 0];
    }
    
    getRelativePosition(direction){
        let relative;
        if(this.positionMapping.hasOwnProperty(direction)){
            relative = this.positionMapping[direction];
        }else{
            relative = direction;
        }
        return [this.position[0] + relative[0], this.position[1] + relative[1]];
    }
    
    moveBlock(direction){
        this.position = this.getRelativePosition(direction);
    }

    moveRelative(offset){
        this.position[0] += offset[0];
        this.position[1] += offset[1];
    }

    getPosition(){
        return this.position;
    }
}

export default BlockPositionManager
