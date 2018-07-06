define(["constants"], function(constants){
    var bpm = function(block){

        this.positionMapping = {};
        this.positionMapping[constants.LEFT] = [-1, 0];
        this.positionMapping[constants.RIGHT] = [1, 0];
        this.positionMapping[constants.DOWN] = [0, 1];

        this.setInitialPosition = function(block){
            var blockWidth = block[0].length;
            var startX = Math.floor((constants.BOARD_WIDTH - blockWidth) / 2);
            this.position = [startX, 0];
        };

        this.setInitialPosition(block);

        this.getRelativePosition = function(direction){
            var relative;
            if(this.positionMapping.hasOwnProperty(direction)){
                relative = this.positionMapping[direction];
            }else{
                relative = direction;
            }
            return [this.position[0] + relative[0], this.position[1] + relative[1]];

        };

        this.moveBlock = function(direction){
            this.position = this.getRelativePosition(direction);
        };

        this.moveRelative = function(offset){
            this.position[0] += offset[0];
            this.position[1] += offset[1];
        };

        this.getPosition = function(){
            return this.position;
        };
    };

    return bpm;
});
