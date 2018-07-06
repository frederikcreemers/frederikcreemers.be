define(function(){
    var graphics = function(){
        var canvas = document.getElementById("screen");
        var ctx = canvas.getContext('2d');

        this.drawGame = function(game){
            this.clear();
            this.drawBoardRect(game);
            this.drawGhostBlock(game);
            this.drawFallingBlock(game);
            this.drawLockedBlocks(game);
            this.drawStats(game);
            this.drawNextBlock(game);
        };

        this.drawStats = function(game){
            ctx.fillStyle = "rgb(200, 200, 50)";
            ctx.font = "18px Verdana";
            ctx.fillText("Score:", 10, 30);
                        ctx.fillText(game.getScore(), 10, 55);
            ctx.fillText("Lines:", 10, 125);
            ctx.fillText(game.getLines(), 10, 150);
            ctx.fillText("Level:", 10, 220);
            ctx.fillText(game.getLevel(), 10, 245);
        };

        this.drawNextBlock = function(game){
            var block = game.getNextBlock();
            var blockSize = (80 / block[0].length);
            for(var y=0; y<block.length; y++){
                for(var x=0; x<block[0].length; x++){
                    if(block[y][x] !== 0){
                        this.drawSquare(x, y+2, block[y][x], 430, 10, blockSize);
                    }
                }
            }
        };

        this.drawBoardRect = function(game){
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.strokeStyle = "rgb(200, 200, 50)";
            var board = game.getBoard();
            ctx.fillRect(100, 10, board[0].length*32, (board.length - 2)*32);
            ctx.lineWidth = 4;
            ctx.strokeRect(98, 8, board[0].length*32 + 4, (board.length - 2)*32 + 4);
        };

        this.drawFallingBlock = function(game){
            position = game.getBlockPosition();
            var block = game.getCurrentBlock();
            for(var y=0; y<block.length; y++){
                for(var x=0; x<block[0].length; x++){
                    if(block[y][x] !== 0){
                        this.drawSquare(position[0] + x, position[1] + y, block[y][x]);
                    }
                }
            }
        };

        this.drawLockedBlocks = function(game){
            var board = game.getBoard();
            for(var y=0; y<board.length; y++){
                for(var x=0; x<board[0].length; x++){
                    if(board[y][x] !== 0){
                        this.drawSquare(x, y, board[y][x]);
                    }
                }
            }
        };

        var colors = ["rgba(255, 32, 32, 0.50)", //bomma
                      "rgba(255, 100, 100, 0.50)", //elisabeth
                      "rgba(32, 32, 255, 0.50)",//guido
                      "rgba(255, 255, 32, 0.50)",//hilde
                      "rgba(255, 32, 255, 0.50)",//leen
                      "rgba(181, 181, 255, 0.50)",//moniek
                      "rgba(200, 200, 255, 0.50)", //rita
                      "rgba(32, 255, 255, 0.50)"];//toon

        this.drawSquare = function(x, y, type, left, top, squareSize){
            if(y < 2) return;
            y -= 2;

            left = left || 100;
            top = top || 10;
            squareSize = squareSize || 32;

            var face = this.faces[type-1];

            ctx.drawImage(face, left+x*squareSize, top + y*squareSize, squareSize, squareSize);

            ctx.fillStyle = colors[type-1];
            ctx.fillRect(left + x*squareSize, top + y*squareSize, squareSize, squareSize);

        };

        this.drawGhostSquare = function(x, y, type){
            if(y < 2) return;
            y -= 2;
            ctx.lineWidth = 1;
            ctx.strokeStyle = colors[type-1];
            ctx.strokeRect(100 + x*32, 10 + y*32, 32, 32);
        };

        this.drawGhostBlock = function(game){
            var position = game.getGhostPosition();
            var block = game.getCurrentBlock();
            for(var y=0; y<block.length; y++){
                for(var x=0; x<block[0].length; x++){
                    if(block[y][x] !== 0){
                        this.drawGhostSquare(position[0] + x, position[1] + y, block[y][x]);
                    }
                }
            }
        };

        this.getFaces = function(){
            return [
                document.getElementById("bomma"),
                document.getElementById("elisabeth"),
                document.getElementById("guido"),
                document.getElementById("hilde"),
                document.getElementById("leen"),
                document.getElementById("moniek"),
                document.getElementById("rita"),
                document.getElementById("toon")
            ];
        };

        this.faces = this.getFaces();

        this.clear = function(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
    };
    return graphics;
});
