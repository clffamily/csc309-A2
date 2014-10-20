var canvas;
var context;
var blueBricks = [];
var redBricks = [];
var yellowBricks = [];
var allBricks = [blueBricks, redBricks, yellowBricks];

/* Initialization of variables for game play */
var gameScoreBoard = new ScoreBoard();
var gamePaddle = new Paddle();
var gameBall = new Ball();
var ballHitTop = false;
var paddleShrunk = false;
var canvasClicked = false;
var bricksCreated = false;
var isGameOver = false;
var intervalID;

window.onload = function() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    drawAll();
    canvas.onmousedown = startBallGamePlay;
    canvas.onmousemove = paddleMoveGamePlay;     
}

/* 
This function deals with setting up the ball at the beginning of a game
*/
function startBallGamePlay() {
    if (!canvasClicked) {
        isGameOver = false;
        canvasClicked = true;
        intervalID = setInterval(function(){ gameBall.move(); drawAll();}, 1);
    }
}

/* 
This function deals with paddle movement throughout a game
*/
function paddleMoveGamePlay(e) {
    var horizontalPos = e.pageX - canvas.offsetLeft;
    gamePaddle.move(horizontalPos);
}


/*
When site is first loaded, draws background.
*/
function drawBackground() {
    context.fillStyle = "#000000";
    context.fillRect(0,0,canvas.width,canvas.height);
}

/*
Draws boundaries top, left and right which the ball will not be abel to pass
through.
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

/*
Class object for the scoreboard which will display score and other messages
*/
function ScoreBoard (){
    this.score = 0;
}

/*
Method to reset score
*/
ScoreBoard.prototype.reset = function() {
    this.score = 0;
}

/*
Method to draw scoreboard messages. If the game is not over and the canvas was 
clicked, display score. If the game is not over and the canvas was not click,
display some intro message. If the game is over, display some game over 
message.
*/
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

/*
Method to add point to score
*/
ScoreBoard.prototype.addPoint = function() {
    this.score++;
    this.draw();
};

/*
Class object for paddle, constructor establishes its initial position.
*/
function Paddle () {
    this.x = 450;
    this.y = 630;
    this.topLx = 375;    
    this.topRx = 525;
    this.length = 300;
}

/*
Method to reset paddle
*/
Paddle.prototype.reset = function() {
    this.length = 300;
}
/*
Method to shrink paddle
*/
Paddle.prototype.shrink = function() {
    this.length = this.length/2;
}
/*
Method to draw paddle
*/
Paddle.prototype.draw = function() {
    if (ballHitTop && !paddleShrunk) {
        this.shrink();
        paddleShrunk = true;
    }
    context.fillStyle = "#FFFFFF";
    context.fillRect(this.x - (this.length / 2),this.y,this.length,10);
};


/*
Method to move paddle based on the horizontal position of the mouse.
*/
Paddle.prototype.move = function(horizontalPos) {
    lengthPlusBound = 30 + (this.length / 2)
    if (horizontalPos < lengthPlusBound) {
        this.x = lengthPlusBound;
    }
    else if (horizontalPos > canvas.width - lengthPlusBound) {
        this.x = canvas.width - lengthPlusBound; 
    }
    else {
        this.x = horizontalPos;
    }
    this.topLx = this.x - (this.length / 2);
    this.topRx = this.x + (this.length / 2);
};

/*
Class object for the single ball
*/
function Ball () {
    this.size = 10;
    ballReset(this);
}

/*
Given a ball object, sets the initial position, and, in relation to this 
position, sets varibles to keep track of the upper left and right, and lower
left and right, position of the ball. Also resets the speedMultiplier of the 
ball (how fast the ball moves), and also the changeInX and changeInY (how much
the ball moves on either axis).
*/
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

//Instance variable to keep track of whether the ball is in the same vacinity
//as the paddle.
Ball.prototype.offPaddle = true;

/*
Method to determine if the ball has hit the paddle. The paddle is divided into
5 sections, and depending on where the ball hits, it's returning angle will be
different.
(1) if the ball hits the extreme ends of the paddle it is returned along the
same path from which it hit the paddle.
(2) if the ball hits some middle of left, or middle of right section of the
paddle then the ball is returned upwards but at a slightly higher angle than
the reflected angle along the y-axis at the point where the ball hit the 
paddle.
(3) if the ball hits the middle of the paddle then it is returned in the
opposite direction at the angle reflected along the y-axis at the point where 
it hit the paddle. 
*/
Ball.prototype.hitPaddle = function() {
    
    var fivePercentLength = gamePaddle.length * 0.05;
    var twentyPercentLength = gamePaddle.length * 0.2;
    var fiftyPercentLength = gamePaddle.length * 0.5;
    
    
    if (this.bottomR[1] >= gamePaddle.y) {
        
        //left of paddle    
        if (this._hitPaddle((this.bottomR[0] <= gamePaddle.topRx - 
        (gamePaddle.length - fivePercentLength)),        
        (this.bottomL[0] >= gamePaddle.topLx))) {
            this.changeIny = this.changeIny * -1.25;
            if (this.changeInx >= 0) {
                this.changeInx = this.changeInx * -1;
            }
        }
                    
        //middle-left of paddle
        if (this._hitPaddle((this.bottomR[0] <= gamePaddle.topRx - 
        (gamePaddle.length - fivePercentLength - twentyPercentLength)), 
        (this.bottomL[0] >= gamePaddle.topLx + fivePercentLength))) {
            this.changeIny = this.changeIny * -1.1;
            if (this.changeInx >= 0) {
                this.changeInx = this.changeInx * -1;
            }
        }
        
        //middle of paddle
        else if (this._hitPaddle((this.bottomR[0] <= gamePaddle.topRx - 
        (gamePaddle.length - fivePercentLength - twentyPercentLength - fiftyPercentLength)), 
        (this.bottomL[0] >= gamePaddle.topLx + fivePercentLength + twentyPercentLength))) {
            this.changeIny = this.changeIny * -1;
        }
        
        //middle-right of paddle
        else if (this._hitPaddle((this.bottomR[0] <= gamePaddle.topRx -
        (gamePaddle.length - fivePercentLength - (twentyPercentLength * 2) - fiftyPercentLength)), 
        (this.bottomL[0] >= gamePaddle.topLx + fivePercentLength + twentyPercentLength + fiftyPercentLength))) {
            this.changeIny = this.changeIny * -1.1;
            if (this.changeInx < 0) {
                this.changeInx = this.changeInx * -1;
            }
        }
        
        //right of paddle
        else if (this._hitPaddle((this.bottomR[0] <= gamePaddle.topRx) && 
        (this.bottomL[0] >= gamePaddle.topLx + fivePercentLength + (twentyPercentLength * 2) + fiftyPercentLength))) {
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

/*
Helper method the returns true and sets offPaddle to false if both 
conditionRight and conditionLeft are true. Othewise, it returns false.
*/
Ball.prototype._hitPaddle = function(conditionRight, conditionLeft) {
    if (conditionRight && conditionLeft && this.offPaddle) {
        this.offPaddle = false;
        return true;
    }
    return false;
}

/*
Method to determine if the ball hit the top boundary, if it has the ball is
returned in the opposite direction but at the angle reflected along the y-axis
where the ball struck the boundary.
*/
Ball.prototype.hitTopBoundary = function() {
    if (this.topL[1] <= 100) {
        ballHitTop = true;
        this.changeIny = 2;
        this.changePos();
    }
}

/*
Method to determine if the ball hit the left boundary, if it has the ball is
returned in the opposite direction but at the angle reflected along the y-axis
where the ball struck the boundary.
*/
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

/*
Method to determine if the ball hit the right boundary, if it has the ball is
returned in the opposite direction but at the angle reflected along the y-axis
where the ball struck the boundary.
*/
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

/*
Method to determine if the ball hit a single brick, if it has the ball is
returned in the opposite direction but at the angle reflected along the y-axis
where the ball struck the brick.
*/
Ball.prototype.hitBricks = function(scoreboard){
    for (var i = 0; i < allBricks.length; i++) {
        for (var j = 0; j < allBricks[i].length; j++) {
            allBricks[i][j].ballHitBrick(this, scoreboard);
        }
    }
}

/*
Method to reset the ball position and all its associated instance variables.
*/
Ball.prototype.reset = function() {
    ballReset(this)
}

/*
Method that determines if the ball is outside the range of the canvas/game 
play. If this is the case then all game play elements are reset.
*/
Ball.prototype.hitGameOver = function() {
    if (this.bottomR[1] > 650) {
        ballReset(this);
        gameScoreBoard.reset();
        brickReset();
        gamePaddle.reset();
        canvasClicked = false;
        isGameOver = true;
        ballHitTop = false;
        paddleShrunk = false;
        clearInterval(intervalID);
        //alert("You lost. Try again!");       
    }
}    

/*
Method to draw the ball within canvas context based on its position variables
*/
Ball.prototype.draw = function() {
    context.beginPath();
    context.arc(this.x + 5, this.y + 5, 5, 0, 2 * Math.PI);
    context.fillStyle = '#FFFFFF';
    context.fill();
    context.strokeStyle = '#FFFFFF';
    context.stroke();
}

/*
Method to move the ball based on its current position and determining whether
it has hit any game play objects.
*/
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

/*
Method to advance the position of the ball element, by changing its x and y
position based on changeInx and changeIny instance variable multiplied by 
the speedMultiplier. Also upper left and right, and lower left and right 
position variables are updated accordingly.
*/
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

/*
Class object brick is an element in game play, if the ball hits a brick it
disappears and we gain a point in score value.
*/
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

/*
Method to determine if ball has hit the brick object, if this is the case
the score value in scoreboard in incremented by 1. Depending on which color
birck the ball hits its speed could be increased or decreased.
*/
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

/*
Method returns true if ball position has intersected the position of the brick.
Returns false otherwise. 
*/
Brick.prototype.isBallHitBrick = function(ball){
    if (ball.bottomR[0] > this.topL[0] && ball.bottomL[0] < this.topR[0]
            && ball.bottomR[1] > this.topL[1] && ball.topR[1] < this.bottomR[1]){
            return true;
    }
    return false;
}

/*
Method the draws a brick. All bricks are the same size 100 x 20 pixels, with
white border, but color can differ.
*/
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

/*
Method to reset brick (ie. make it visible)
*/
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

/*
Return true if the ball has intersected the space of any of the bricks
*/
function brickReset(){
    for (var i = 0; i < allBricks.length; i++) {
        for (var j = 0; j < allBricks[i].length; j++) {
            allBricks[i][j].reset();
        }
    }
}

/*
Return true if any bricks are visible.
*/
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

/*
Function that creates bricks at the initialization of a game, resets bricks 
if non are visible and the ball does not intersect any bricks, and finally 
draws all bricks that are currently set to visible.
*/
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

/*
Function to create all blue bricks.
*/
function createBlueBricks(){
    //Create upper layer blue bricks
    createALineofBricks( 30, 150, 9, "Blue", "x", 100);
    //Create lower layer blue bricks
    createALineofBricks( 30, 270, 9, "Blue", "x", 100);
    createALineofBricks( 30, 290, 9, "Blue", "x", 100);
    // //Create left layer blue bricks
    createALineofBricks( 100, 170, 5, "Blue", "y", 20);
    // //Create right layer blue bricks
    createALineofBricks( 700, 170, 5, "Blue", "y", 20);
}

/*
Function to create all red bricks.
*/
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

/*
Function to create all yellow bricks.
*/
function createYellowBricks(){
    //Create three lines of yellow bricks
    createALineofBricks( 300, 190, 3, "Yellow", "x", 100);
    createALineofBricks( 300, 210, 3, "Yellow", "x", 100);
    createALineofBricks( 300, 230, 3, "Yellow", "x", 100);
}

/*
Function to create a line of bricks from a starting position of x and y, the
number of bricks (iteration), the color of brick, the direction line of bricks,
and the spacing between bricks (increment).
*/
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

/*
Function to draw all elements of game play, at each call it clears the 
context.
*/
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

