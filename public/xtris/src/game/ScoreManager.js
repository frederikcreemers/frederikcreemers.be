import * as constants from "./constants.js";

class ScoreManager {
    constructor(){
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        
        this.linesToNextLevel = constants.LINES_PER_LEVEL;
        
        this.getScore = () => this.score
        this.getLines = () => this.lines
        this.getLevel = () => this.level
    }
    
    updateWithLines(lines){
        this.lines += lines;

        let multiplier = constants.LEVEL_SCORE_MULTIPLIERS[lines];
        this.score += multiplier * this.level;

        this.linesToNextLevel -= lines;

        if (this.linesToNextLevel <= 0){
            this.linesToNextLevel += constants.LINES_PER_LEVEL;
            this.level += 1;
        }
    }
}

export default ScoreManager

