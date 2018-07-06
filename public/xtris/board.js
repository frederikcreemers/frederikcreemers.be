define(["constants"], function(constants){
    var board = function(){
        this.grid = [];
        var self = this;

        var addRow = function(){
            var row = [];
            for(var c=0; c<constants.BOARD_WIDTH; c++){
                row.push(0);
            }
            self.grid.unshift(row);

        };

        //Initialize the grid
        for (var r=0; r<constants.BOARD_HEIGHT; r++){
            addRow();
        }

        this.asArray = function(){
            return this.grid;
        };

        this.canPlaceBlock = function(block, position){
            var posX = position[0];
            var posY = position[1];
            for(var y=0; y<block.length; y++){
                for(var x=0; x<block[0].length; x++){
                    var leftOff = (x + posX) < 0,
                        rightOff = (x + posX) >= constants.BOARD_WIDTH;
                        bottomOff = (y + posY) >= constants.BOARD_HEIGHT;
                    if(block[y][x] !== 0 &&
                       (leftOff || rightOff || bottomOff || this.grid[posY+y][posX+x] !== 0)){
                        return false;
                    }
                }
            }
            return true;
        };

        this.placeBlockAndCheckLines = function(block, position){
            var posX = position[0];
            var posY = position[1];
            var fullLines = [];
            for(var y=0; y<block.length; y++){
                for(var x=0; x<block[0].length; x++){
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
        };

        this.isLineFull = function(y){
            if(y < 0 || y >= this.grid.length){
                return false;
            }
            for(var x=0; x<constants.BOARD_WIDTH; x++){
                if(this.grid[y][x] === 0){
                    return false;
                }
            }
            return true;
        };

        this.removeLines = function(lines){
            for(var i=0; i<lines.length; i++){
                this.grid.splice(lines[i], 1);
                addRow();
            }
        };
    };
    return board;
});
