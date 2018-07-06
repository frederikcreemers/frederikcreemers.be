function init(){
    console.log("init called");
    require(["gameRunner"], function(gameRunner){
        gameRunner.run();
    });
}

init();
