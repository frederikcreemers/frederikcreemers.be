class Graphics{
    constructor(canvas){
        console.log("canvas in graphics: " + canvas)
        this.canvas = canvas
        
        this.ctx = canvas.getContext('2d');
        this.faces = this.getFaces();
        
        this.colors = ["rgba(255, 32, 32, 0.50)", //bomma
        "rgba(255, 100, 100, 0.50)", //elisabeth
        "rgba(32, 32, 255, 0.50)",//guido
        "rgba(255, 255, 32, 0.50)",//hilde
        "rgba(255, 32, 255, 0.50)",//leen
        "rgba(181, 181, 255, 0.50)",//moniek
        "rgba(200, 200, 255, 0.50)", //rita
        "rgba(32, 255, 255, 0.50)"];//toon
    }

    drawGame(game){
        this.clear();
        this.drawBoardRect(game);
        this.drawGhostBlock(game);
        this.drawFallingBlock(game);
        this.drawLockedBlocks(game);
        this.drawStats(game);
        this.drawNextBlock(game);
    }

    drawStats(game){
        this.ctx.fillStyle = "rgb(200, 200, 50)";
        this.ctx.font = "18px Verdana";
        this.ctx.fillText("Score:", 10, 30);
        this.ctx.fillText(game.getScore(), 10, 55);
        this.ctx.fillText("Lines:", 10, 125);
        this.ctx.fillText(game.getLines(), 10, 150);
        this.ctx.fillText("Level:", 10, 220);
        this.ctx.fillText(game.getLevel(), 10, 245);
    }

    drawNextBlock(game){
        let block = game.getNextBlock();
        let blockSize = (80 / block[0].length);
        for(let y=0; y<block.length; y++){
            for(let x=0; x<block[0].length; x++){
                if(block[y][x] !== 0){
                    this.drawSquare(x, y+2, block[y][x], 430, 10, blockSize);
                }
            }
        }
    }

    drawBoardRect(game){
        this.ctx.fillStyle = "rgb(0, 0, 0)";
        this.ctx.strokeStyle = "rgb(200, 200, 50)";
        let board = game.getBoard();
        this.ctx.fillRect(100, 10, board[0].length*32, (board.length - 2)*32);
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(98, 8, board[0].length*32 + 4, (board.length - 2)*32 + 4);
    }

    drawFallingBlock(game){
        let position = game.getBlockPosition();
        let block = game.getCurrentBlock();
        for(let y=0; y<block.length; y++){
            for(let x=0; x<block[0].length; x++){
                if(block[y][x] !== 0){
                    this.drawSquare(position[0] + x, position[1] + y, block[y][x]);
                }
            }
        }
    }

    drawLockedBlocks(game){
        let board = game.getBoard();
        for(let y=0; y<board.length; y++){
            for(let x=0; x<board[0].length; x++){
                if(board[y][x] !== 0){
                    this.drawSquare(x, y, board[y][x]);
                }
            }
        }
    }

    drawSquare(x, y, type, left, top, squareSize){
        if(y < 2) return;
        y -= 2;

        left = left || 100;
        top = top || 10;
        squareSize = squareSize || 32;

        let face = this.faces[type-1];

        this.ctx.drawImage(face, left+x*squareSize, top + y*squareSize, squareSize, squareSize);

        this.ctx.fillStyle = this.colors[type-1];
        this.ctx.fillRect(left + x*squareSize, top + y*squareSize, squareSize, squareSize);
    }

    drawGhostSquare(x, y, type){
        if(y < 2) return;
        y -= 2;
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = this.colors[type-1];
        this.ctx.strokeRect(100 + x*32, 10 + y*32, 32, 32);
    }

    drawGhostBlock(game){
        let position = game.getGhostPosition();
        let block = game.getCurrentBlock();
        for(let y=0; y<block.length; y++){
            for(let x=0; x<block[0].length; x++){
                if(block[y][x] !== 0){
                    this.drawGhostSquare(position[0] + x, position[1] + y, block[y][x]);
                }
            }
        }
    }

    getFaces(){
        let faces = [];
        for (let i=0; i<7; i++){
            let img = new Image();
            img.src = `/faces/${i}.png`;
            faces.push(img);
        }
        return faces;
    }


    clear(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

export default Graphics
