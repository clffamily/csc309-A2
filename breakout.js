var canvas;
var context;
var gameScoreBoard = new ScoreBoard();
var gamePaddle = new Paddle();
var gameBall = new Ball();
var canvasClicked = false;
var bricksCreated = false;
var isGameOver = false;
var blueBricks = [];
var redBricks = [];
var yellowBricks = [];
var allBricks = [blueBricks, redBricks, yellowBricks];
var intervalID;

window.onload = function() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    drawAll();
    canvas.onmousedown = startBallGamePlay;
    canvas.onmousemove = paddleMoveGamePlay;     
}

function startBallGamePlay() {
    if (!canvasClicked) {
        isGameOver = false;
        canvasClicked = true;
        intervalID = setInterval(function(){ gameBall.move(); drawAll();}, 1);
    }
}

function paddleMoveGamePlay(e) {
    var horizontalPos = e.pageX - canvas.offsetLeft;
    gamePaddle.move(horizontalPos);
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
    
    if (!isGameOver && canvasClicked) {
        context.fillText("Score: " + this.score,390,40);
    }
    
    else if  (!isGameOver && !canvasClicked) {
        context.fillText("Click anywhere to begin!",280,40);
    }
    
    else if (isGameOver) {
        context.fillText("You lost. Try again!",300,40);
    }
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
    else if (horizontalPos > canvas.width - 105) {
        this.x = canvas.width - 105; 
    }
    else {
        this.x = horizontalPos;
    }
    this.topLx = this.x - 75;
    this.topRx = this.x + 75;
};

function Ball () {
    this.size = 10;
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
    ball.changeInx = 2;
    ball.changeIny = 2;
}

Ball.prototype.offPaddle = true;

Ball.prototype.hitPaddle = function() {
    if (this.bottomR[1] >= gamePaddle.y) {
        
        //left of paddle    
        if (this._hitPaddle((this.bottomR[0] <= gamePaddle.topRx - 140),        
        (this.bottomL[0] >= gamePaddle.topLx))) {
            this.changeIny = this.changeIny * -1.25;
            if (this.changeInx >= 0) {
                this.changeInx = this.changeInx * -1;
            }
        }
                    
        //middle-left of paddle
        if (this._hitPaddle((this.bottomR[0] <= gamePaddle.topRx - 90), 
        (this.bottomL[0] >= gamePaddle.topLx + 10))) {
            this.changeIny = this.changeIny * -1.1;
            if (this.changeInx >= 0) {
                this.changeInx = this.changeInx * -1;
            }
        }
        
        //middle of paddle
        else if (this._hitPaddle((this.bottomR[0] <= gamePaddle.topRx - 60), 
        (this.bottomL[0] >= gamePaddle.topLx + 60))) {
            this.changeIny = this.changeIny * -1;
        }
        
        //middle-right of paddle
        else if (this._hitPaddle((this.bottomR[0] <= gamePaddle.topRx -10), 
        (this.bottomL[0] >= gamePaddle.topLx + 90))) {
            this.changeIny = this.changeIny * -1.1;
            if (this.changeInx < 0) {
                this.changeInx = this.changeInx * -1;
            }
        }
        
        //right of paddle
        else if (this._hitPaddle((this.bottomR[0] <= gamePaddle.topRx) && 
        (this.bottomL[0] >= gamePaddle.topLx + 140))) {
            this.changeIny = this.changeIny * -1.25;
            if (this.changeInx < 0) {
                this.changeInx = this.changeInx * -1;
            }
        }
        
        this.changePos();
    }
    else {
        this.offPaddle = true;
    }
}

Ball.prototype._hitPaddle = function(conditionRight, conditionLeft) {
    if (conditionRight && conditionLeft && this.offPaddle) {
        this.offPaddle = false;
        return true;
    }
    return false;
}

Ball.prototype.hitTopBoundary = function() {
    if (this.topL[1] <= 100) {
        this.changeIny = 2;
        this.changePos();
    }
}

Ball.prototype.hitLeftBoundary = function() {
    if (this.topL[0] <= 30) {
        this.changeInx = 2;
        if (this.changeIny < 0) {
            this.changeIny = -2;
        }
        else {
            this.changeIny = 2; 
        }
        this.changePos();
    }
}

Ball.prototype.hitRightBoundary = function() {
    if (this.topR[0] >= canvas.width - 30) {
        this.changeInx = -2;
        if (this.changeIny < 0) {
            this.changeIny = -2;
        }
        else {
            this.changeIny = 2; 
        }
        this.changePos();
    }
}

Ball.prototype.hitBricks = function(scoreboard){
    for (var i = 0; i < allBricks.length; i++) {
        for (var j = 0; j < allBricks[i].length; j++) {
            allBricks[i][j].ballHitBrick(this, scoreboard);
        }
    }
}

Ball.prototype.reset = function() {
    ballReset (this)
}

Ball.prototype.hitGameOver = function() {
    if (this.bottomR[1] > 650) {
        ballReset(this);
        gameScoreBoard.reset();
        brickReset();
        canvasClicked = false;
        isGameOver = true;
        clearInterval(intervalID);
        //alert("You lost. Try again!");       
    }
}    

Ball.prototype.draw = function() {
    context.beginPath();
    context.arc(this.x + 5, this.y + 5, 5, 0, 2 * Math.PI);
    context.fillStyle = '#FFFFFF';
    context.fill();
    context.strokeStyle = '#FFFFFF';
    context.stroke();
}

Ball.prototype.move = function() {
    if (canvasClicked) {
        this.hitPaddle();
        this.changePos();
        this.hitTopBoundary();
        this.hitLeftBoundary();
        this.hitRightBoundary();
        this.hitBricks(gameScoreBoard);
        this.hitGameOver(); 
    }   
}

Ball.prototype.changePos = function() {
    newXPos = this.changeInx * this.speedMultiplier
    newYPos = this.changeIny * this.speedMultiplier
    this.x += newXPos;
    this.y += newYPos;
    this.topR[0] += newXPos;
    this.topR[1] += newYPos;
    this.topL[0] += newXPos;
    this.topL[1] += newYPos;
    this.bottomR[0] += newXPos;
    this.bottomR[1] += newYPos;
    this.bottomL[0] += newXPos;
    this.bottomL[1] += newYPos;
}

function Brick( x , y , color, colorName ){
    this.x = x;
    this.y = y;
    this.topL = [x , y];
    this.topR = [x + 100, y];
    this.bottomL = [x, y + 20];
    this.bottomR = [x + 100, y + 20]; 
    this.color = color;
    this.colorName = colorName;
    this.visible = true;
}

Brick.prototype.ballHitBrick = function(ball, scoreboard){
    if (this.visible){
        if (this.isBallHitBrick(ball)){
            this.visible = false;
            
            if (this.colorName == "Blue") {
                ball.speedMultiplier = 1
            }
            
            if (this.colorName == "Red") {
                ball.speedMultiplier = 1.2
            }
            
            if (this.colorName == "Yellow") {
                ball.speedMultiplier = 1.4
            }
            
            ball.changeIny = ball.changeIny * -1;
            scoreboard.addPoint();
        }
    }             
}

Brick.prototype.isBallHitBrick = function(Ball){
    if (Ball.bottomR[0] > this.topL[0] && Ball.bottomL[0] < this.topR[0]
            && Ball.bottomR[1] > this.topL[1] && Ball.topR[1] < this.bottomR[1]){
            return true;
    }
    return false;
}

Brick.prototype.draw = function(){
    if (this.visible){
        context.fillStyle = this.color;
        context.fillRect(this.x,this.y,100,20);
        context.strokeStyle = '#FFFFFF';
        context.beginPath();
        context.moveTo(this.x, this.y);
        context.lineTo(this.x + 100, this.y);
        context.lineTo(this.x + 100, this.y + 20);
        context.lineTo(this.x, this.y + 20);
        context.lineTo(this.x, this.y);
        context.lineWidth = 2;
        context.closePath();
        context.stroke();
    }   
}

Brick.prototype.reset = function (){
    this.visible = true;
}

function ballOnBrick() {
    for (var i = 0; i < allBricks.length; i++) {
        for (var j = 0; j < allBricks[i].length; j++) {
            if (allBricks[i][j].isBallHitBrick(gameBall)){
                return true;
            }
        }
    }
    return false;
}

function brickReset(){
    for (var i = 0; i < allBricks.length; i++) {
        for (var j = 0; j < allBricks[i].length; j++) {
            allBricks[i][j].reset();
        }
    }
}

function isBrickVisible() {
    for (var i = 0; i < allBricks.length; i++) {
        for (var j = 0; j < allBricks[i].length; j++) {
            if (allBricks[i][j].visible){
                return true;
            }
        }
    }
    return false;
}


function drawBricks(){
    if (!bricksCreated){
        createBlueBricks();
        createRedBricks();
        createYellowBricks();
        bricksCreated = true;
    }
    if (!isBrickVisible() && !ballOnBrick()) {
            brickReset();
    }
    for (var i = 0; i < allBricks.length; i++) {
        for (var j = 0; j < allBricks[i].length; j++) {
            allBricks[i][j].draw();
        }
    }
}

function createBlueBricks(){
    //Create upper layer blue bricks
    createALineofBricks( 30, 150, 9, "Blue", "x", 100);
    //Create lower layer blue bricks
    createALineofBricks( 30, 270, 9, "Blue", "x", 100);
    // //Create left layer blue bricks
    createALineofBricks( 100, 170, 5, "Blue", "y", 20);
    // //Create right layer blue bricks
    createALineofBricks( 700, 170, 5, "Blue", "y", 20);
}

function createRedBricks(){
    //Create upper layer blue bricks
    createALineofBricks( 200, 170, 5, "Red", "x", 100);
    //Create lower layer blue bricks
    createALineofBricks( 200, 250, 5, "Red", "x", 100);
    // //Create left layer blue bricks
    createALineofBricks( 200, 190, 3, "Red", "y", 20);
    // //Create right layer blue bricks
    createALineofBricks( 600, 190, 3, "Red", "y", 20);   
}

function createYellowBricks(){
    //Create three lines of yellow bricks
    createALineofBricks( 300, 190, 3, "Yellow", "x", 100);
    createALineofBricks( 300, 210, 3, "Yellow", "x", 100);
    createALineofBricks( 300, 230, 3, "Yellow", "x", 100);
}

function createALineofBricks(x,y,iteration,color,direction,increment){
    var x = x;
    var y = y;
    for (var i = 1; i <=iteration; i++) {
        if (color == "Blue"){
            var blueBrick = new Brick(x,y,"#00BFFF", "Blue");
            blueBricks.push(blueBrick);
        }
        else if (color == "Red"){
            var redBrick = new Brick(x,y,"#CD5C5C", "Red");
            redBricks.push(redBrick);
        }
        else if(color == "Yellow"){
            var yellowBrick = new Brick(x,y,"#FFD700", "Yellow");
            yellowBricks.push(yellowBrick);
        }
        
        if (direction == "x") { x = x + increment;}
        else if(direction == "y") { y = y + increment; }
    }
}


function drawAll () { 
//Clear context
    context.clearRect(0, 0, canvas.width, canvas.height);
    
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
    drawBricks();
}

