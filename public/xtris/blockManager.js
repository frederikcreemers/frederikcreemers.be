define(["blockFactory"], function(blockFactory){
    blockManager = function(){
        this.blocks = blockFactory.getBlocks();
        this.blockPreviews = blockFactory.getPreviews();
        this.offsets = blockFactory.getKickOffsets();

        this.rotation = 0;

        this.initQueue = function(){
            this.queue = [this.getRandomBlock(), this.getRandomBlock()];
        };

        this.getCurrentBlock = function(){
            return this.blocks[this.queue[0]][this.rotation];
        };

        this.getNextBlock = function(){
            return this.blockPreviews[this.queue[1]];

        };

        this.rotateLeft = function(){
            var from = this.rotation;
            this.rotation -= 1;
            if (this.rotation < 0){
                this.rotation = 3;
            }
            return this.calculateKickOffset(from, this.rotation);
        };

        this.rotateRight = function(){
            var from = this.rotation;
            this.rotation = (this.rotation + 1) % 4;
            return this.calculateKickOffset(from, this.rotation);
        };

        this.calculateKickOffset = function(from, to){
            var fromOffsets = this.offsets[this.queue[0]][from];
            var toOffsets = this.offsets[this.queue[0]][to];
            var offsets = [];
            for(var i=0; i<fromOffsets.length; i++){
                var o1 = fromOffsets[i];
                var o2 = toOffsets[i];
                offsets.push([o1[0] - o2[0], o1[1] - o2[1]]);
            }
            return offsets;
        };

        this.nextBlock = function(){
            this.queue.shift();
            this.queue.push(this.getRandomBlock());
            this.rotation = 0;
        };

        this.getRandomBlock = function(){
            return Math.floor(Math.random()*this.blocks.length);
        };

        this.initQueue();
    };


    return blockManager;
});
