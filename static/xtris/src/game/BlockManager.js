import BlockFactory from "./BlockFactory.js";


class BlockManager{
    constructor(){
        this.blocks = BlockFactory.getBlocks();
        this.blockPreviews = BlockFactory.getPreviews();
        this.offsets = BlockFactory.getKickOffsets();
        
        this.rotation = 0;
        this.initQueue();
    }
    
    initQueue(){
        this.queue = [this.getRandomBlock(), this.getRandomBlock()];
    }
    
    getCurrentBlock(){
        return this.blocks[this.queue[0]][this.rotation];
    }
    
    getNextBlock(){
        return this.blockPreviews[this.queue[1]];
    }
    
    rotateLeft(){
        let from = this.rotation;
        this.rotation -= 1;
        if (this.rotation < 0){
            this.rotation = 3;
        }
        return this.calculateKickOffset(from, this.rotation);
    }
    
    rotateRight(){
        let from = this.rotation;
        this.rotation = (this.rotation + 1) % 4;
        return this.calculateKickOffset(from, this.rotation);
    }
    
    calculateKickOffset(from, to){
        let fromOffsets = this.offsets[this.queue[0]][from];
        let toOffsets = this.offsets[this.queue[0]][to];
        let offsets = [];
        for(let i=0; i<fromOffsets.length; i++){
            let o1 = fromOffsets[i];
            let o2 = toOffsets[i];
            offsets.push([o1[0] - o2[0], o1[1] - o2[1]]);
        }
        return offsets;
    }
    
    nextBlock(){
        this.queue.shift();
        this.queue.push(this.getRandomBlock());
        this.rotation = 0;
    }
    
    getRandomBlock(){
        return Math.floor(Math.random()*this.blocks.length);
    }
}

export default BlockManager
