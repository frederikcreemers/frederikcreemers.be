define(["constants"], function(constants){
    var ScoreManager = function(){
        this.score = 0;
        this.lines = 0;
        this.level = 1;

        var linesToNextLevel = constants.LINES_PER_LEVEL;

        this.getScore = function(){return this.score;};
        this.getLines = function(){return this.lines;};
        this.getLevel = function(){return this.level;};

        this.updateWithLines = function(lines){
            console.log("updating score");
            this.lines += lines;

            var multiplier = constants.LEVEL_SCORE_MULTIPLIERS[lines];
            console.log("multiplier: " + multiplier);
            this.score += multiplier * this.level;

            linesToNextLevel -= lines;

            if (linesToNextLevel <= 0){
                linesToNextLevel += constants.LINES_PER_LEVEL;
                this.level += 1;
            }
            console.log("score updated: "+this.score+", "+this.level+", "+this.lines);
        };
    };

    return ScoreManager;
});
