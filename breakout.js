var canvas;
var context;
var gameScoreBoard = new ScoreBoard();
var gamePaddle = new Paddle();
var gameBall = new Ball();
var canvasClicked = false;

window.onload = function() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    drawAll();
    canvas.onmousedown = startBallGamePlay;
    canvas.onmousemove = paddleMoveGamePlay;     
}

function startBallGamePlay() {
    if (!canvasClicked) {
        setInterval(function(){gameBall.move()}, 8);
        canvasClicked = true;   
    }
}

function paddleMoveGamePlay(e) {
    var horizontalPos = e.pageX - canvas.offsetLeft;
    gamePaddle.move(horizontalPos);
    drawAll();
}

/*
When site is first loaded, loads all game-play elements.
*/
function drawBackground() {

    //draw the background
    context.fillStyle = "#000000";
    context.fillRect(0,0,canvas.width,canvas.height);
}

/*

*/
function drawBoundaries() {
    
    //draw side and top boundaries
    
    //top
    context.fillStyle = "#636363";
    context.fillRect(0,50,canvas.width,50);
    
    //left
    context.fillStyle = "#636363";
    context.fillRect(0,100,30,canvas.height - 50);
    
    //right
    context.fillStyle = "#636363";
    context.fillRect(canvas.width - 30,100,30,canvas.height - 50);
}

function ScoreBoard (){
    this.score = 0;
}

ScoreBoard.prototype.reset = function() {
    this.score = 0;
}

ScoreBoard.prototype.draw = function() {
    context.font="40px Chicago";
    context.fillStyle = "#FFFFFF";
    context.fillText(this.score,450,40);
};

ScoreBoard.prototype.addPoint = function() {
    this.score++;
    this.draw();
};

function Paddle () {
    this.x = 450;
    this.y = 630;
    this.topLx = 375;    
    this.topRx = 525;
}

Paddle.prototype.draw = function() {
    context.fillStyle = "#FFFFFF";
    context.fillRect(this.x - 75,this.y,150,10);
};

Paddle.prototype.move = function(horizontalPos) {
    if (horizontalPos < 105) {
        this.x = 105;
    }
    else if (horizontalPos > 795) {
        this.x = 795;
    }
    else {
        this.x = horizontalPos;
    }
    this.topLx = this.x - 75;
    this.topRx = this.x + 75;
};

function Ball () {
    this.size = 5;
    ballReset(this);
}

function ballReset (ball) {
    ball.x = 30;
    ball.y = 400;
    ball.topR = [ball.x + ball.size, ball.y];
    ball.topL = [ball.x, ball.y]; 
    ball.bottomR = [ball.x + ball.size, ball.y + ball.size];
    ball.bottomL = [ball.x, ball.y + ball.size];
    ball.speedMultiplier = 1;
    ball.changeInx = 1;
    ball.changeIny = -1;
}

Ball.prototype.hitPaddle = function() {
    if (this.bottomR[1] > gamePaddle.y) {
        
        //left of paddle    
        if ((this.bottomR[0] <= gamePaddle.topRx - 140) && 
        (this.bottomL[0] >= gamePaddle.topLx)) {
            this.changeIny = this.changeIny * -1.25;
            if (this.changeInx >= 0) {
                this.changeInx = this.changeInx * -1;
            }
        }
                    
        //middle-left of paddle
        if ((this.bottomR[0] <= gamePaddle.topRx - 90) && 
        (this.bottomL[0] >= gamePaddle.topLx + 10)) {
            this.changeIny = this.changeIny * -1.25;
        }
        
        //middle of paddle
        else if ((this.bottomR[0] <= gamePaddle.topRx - 60) && 
        (this.bottomL[0] >= gamePaddle.topLx + 60)) {
            this.changeIny = this.changeIny * -1;
        }
        
        //middle-right of paddle
        else if ((this.bottomR[0] <= gamePaddle.topRx -10) && 
        (this.bottomL[0] >= gamePaddle.topLx + 90)) {
            this.changeIny = this.changeIny * -1.25;
        }
        
        //right of paddle
        else if ((this.bottomR[0] <= gamePaddle.topRx) && 
        (this.bottomL[0] >= gamePaddle.topLx + 140)) {
            this.changeIny = this.changeIny * -1.25;
            if (this.changeInx < 0) {
                this.changeInx = this.changeInx * -1;
            }
        }
        
        this.changePos();
    }
}

Ball.prototype.hitTopBoundary = function() {
    if (this.topL[1] <= 100) {
        this.changeIny = 1;
        this.changePos();
    }
}

Ball.prototype.hitLeftBoundary = function() {
    if (this.topL[0] < 30) {
        this.changeInx = 1;
        if (this.changeIny < 0) {
            this.changeIny = -1;
        }
        else {
            this.changeIny = 1; 
        }
        this.changePos();
    }
}

Ball.prototype.hitRightBoundary = function() {
    if (this.topR[0] > canvas.width - 30) {
        this.changeInx = -1;
        if (this.changeIny < 0) {
            this.changeIny = -1;
        }
        else {
            this.changeIny = 1; 
        }
        this.changePos();
    }
}

Ball.prototype.reset = function() {
    ballReset (this)
}

Ball.prototype.hitGameOver = function() {
    if (this.bottomR[1] >= 650) {
        ballReset(this);
        gameScoreBoard.reset();
        // you'll also need to reset the bricks
    }
}    

Ball.prototype.draw = function() {
    context.fillStyle = "#FFFFFF";
    context.fillRect(this.x,this.y,5,5)
}

Ball.prototype.move = function() {
    this.hitPaddle();
    this.hitTopBoundary();
    this.hitLeftBoundary();
    this.hitRightBoundary();
    this.hitGameOver();
    this.changePos();
    drawAll();
}

Ball.prototype.changePos = function() {
    this.x += this.changeInx;
    this.y += this.changeIny;
    this.topR[0] += this.changeInx;
    this.topR[1] += this.changeIny;
    this.topL[0] += this.changeInx;
    this.topL[1] += this.changeIny;
    this.bottomR[0] += this.changeInx;
    this.bottomR[1] += this.changeIny;
    this.bottomL[0] += this.changeInx;
    this.bottomL[1] += this.changeIny;
}

function drawAll () {
//Clear everyting
    context.clearRect(0, 0, 900, 650);
    
//Redraw background
    drawBackground();
    
//Redraw boundaries
    drawBoundaries();

//Redraw scoreboard    
    gameScoreBoard.draw();
    
//Redraw paddle
    gamePaddle.draw();

//Redraw ball
    gameBall.draw();

//Redraw bricks
    //todo
}

