define(["blockManager", "board", "blockPositionManager", "scoreManager", "constants"],
function(BlockManager, Board, BlockPositionManager, ScoreManager, constants){
    var TetrisGame = function(){
        this.board = new Board();
        this.blockManager = new BlockManager();
        this.blockPositionManager = new BlockPositionManager(this.blockManager.getCurrentBlock());
        this.scoreManager = new ScoreManager();

        this.onGameOver = function(score){};

        this.moveBlock = function(direction){
            var newPosition = this.blockPositionManager.getRelativePosition(direction);
            if(!this.board.canPlaceBlock(this.blockManager.getCurrentBlock(), newPosition)){
                return false;
            }
            this.blockPositionManager.moveBlock(direction);
            return true;
        };

        this.moveDown = function(){
            if(!this.moveBlock(constants.DOWN)){
                var lines = this.board.placeBlockAndCheckLines(this.blockManager.getCurrentBlock(), this.blockPositionManager.getPosition());
                this.scoreManager.updateWithLines(lines);
                this.blockManager.nextBlock();
                this.blockPositionManager.setInitialPosition(this.blockManager.getCurrentBlock());

                var block = this.blockManager.getCurrentBlock();
                var position = this.blockPositionManager.getPosition();

                if(!this.board.canPlaceBlock(block, position)){
                    this.onGameOver();
                }
                return false;
            }
            return true;
        };

        this.moveLeft = function(){
            this.moveBlock(constants.LEFT);
        };

        this.moveRight = function(){
            this.moveBlock(constants.RIGHT);
        };

        this.rotateLeft = function(){
            console.log("rotateLeft");
            var offsets = this.blockManager.rotateLeft();
            var currentBlock = this.blockManager.getCurrentBlock();
            for(var i=0; i<offsets.length;i++){
                var offset = offsets[i];
                var position = this.blockPositionManager.getRelativePosition(offset);
                if(this.board.canPlaceBlock(currentBlock, position)){
                    this.blockPositionManager.moveRelative(offset);
                    return true;
                }
            }
            this.blockManager.rotateRight();
            return false;
        };

        this.rotateRight = function(){
            console.log("rotateRight");
            var offsets = this.blockManager.rotateRight();
            var currentBlock = this.blockManager.getCurrentBlock();
            for(var i=0; i<offsets.length;i++){
                var offset = offsets[i];
                var position = this.blockPositionManager.getRelativePosition(offset);
                if(this.board.canPlaceBlock(currentBlock, position)){
                    this.blockPositionManager.moveRelative(offset);
                    return true;
                }
            }
            this.blockManager.rotateLeft();
            return false;
        };

        this.dropDown = function(){
            while(this.moveDown()){
                continue;
            }
        };

        this.getGhostPosition = function(){
            var block = this.blockManager.getCurrentBlock();
            var position = this.blockPositionManager.getPosition();
            var y = position[1];
            while(this.board.canPlaceBlock(block, [position[0], y])){
                y += 1;
            }
            return [position[0], y-1];
        };

        this.getBlockPosition = this.blockPositionManager.getPosition.bind(this.blockPositionManager);
        this.getCurrentBlock = this.blockManager.getCurrentBlock.bind(this.blockManager);
        this.getNextBlock = this.blockManager.getNextBlock.bind(this.blockManager);
        this.getBoard = this.board.asArray.bind(this.board);
        this.getScore = this.scoreManager.getScore.bind(this.scoreManager);
        this.getLevel = this.scoreManager.getLevel.bind(this.scoreManager);
        this.getLines = this.scoreManager.getLines.bind(this.scoreManager);
    };

    return TetrisGame;
});
