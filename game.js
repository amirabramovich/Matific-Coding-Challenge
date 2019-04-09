var canvas = document.getElementById("canvas");
var contxt = canvas.getContext("2d");
var leftKey = false;
var rightKey = false;
var gameOver = true;
var startScreen = true;
var score = 0;
var lives = 3;
var duration = 3000;


document.addEventListener("keydown", keysDown, false);
document.addEventListener("keyup", keysUp, false);

// when key is pressed down, move
function keysDown(e) {
	if(e.key == "Right" || e.key == "ArrowRight"){
		rightKey = true;
	}
	else if(e.key == "Left" || e.key == "ArrowLeft"){
		leftKey = true;
	}
	else if((e.key === ' ' || e.key === 'Spacebar') && gameOver){
		startScreen = false;
		playAgain();
	}
}
// when key is released, stop moving
function keysUp(e) {
	if(e.key == "Right" || e.key == "ArrowRight"){
		rightKey = false;
	}
	else if(e.key == "Left" || e.key == "ArrowLeft"){
		leftKey = false;
	}
}

// player specs
var boat = {
	x: (canvas.width - 244)/ 2,
	y: canvas.height - 153,
	width: 244,
	height: 153,
	speed: 7
};

// plane specs
var plane = {
	x: canvas.width,
	y: 0,
	width: 145,
	height: 113,
	speed: 2
};

// parachuters specs
var parachuters = {
	x:[],
	y:[],
	width: 77,
	height: 90,
	speed: 2
};

// draws boat
function drawBoat() {
	boatImage = new Image();
	boatImage.src = 'resources/boat.png';
	contxt.drawImage(boatImage, boat.x, boat.y);
}

// draws plane
function drawPlane() {
	planeImage = new Image();
	planeImage.src = 'resources/plane.png';
	contxt.drawImage(planeImage, plane.x, plane.y);
}

// draws parachutter
function drawPara() {
	paraImage = new Image();
	paraImage.src = 'resources/parachutist.png';
	for(var i = 0; i < parachuters.x.length; i++)
		contxt.drawImage(paraImage, parachuters.x[i], parachuters.y[i]);
}

// draws the sky and sea
function drawBackground() {
	background = new Image();
	sea = new Image();
	background.src = 'resources/background.png';
	sea.src = 'resources/sea.png';
	contxt.drawImage(background, 0, 0);
	contxt.drawImage(sea, 0, canvas.height-sea.height);
}

// moves the player right/left according to key pressed
function moveBoat() {
	if(leftKey && boat.x > -boat.width/2)
		boat.x -= boat.speed;
	if(rightKey && boat.x + boat.width/2 < canvas.width) 
		boat.x += boat.speed;
}

// flying nonstop
function movePlane(){
	if(plane.x>-plane.width)
		plane.x -= plane.speed;
	else
		plane.x = canvas.width;
}

// move the falling parachuters down
function movePara() {
	for(var i = 0; i < parachuters.x.length; i++)
		parachuters.y[i] += parachuters.speed;
}

// returns true if plane inside the area
function inRange() {
	return (plane.x < canvas.width - plane.width) && (plane.x > 0);
}

// drops parachuters
function dropPara(){
	if(!gameOver && inRange()){
		parachuters.x.push(plane.x + plane.width/2);
		parachuters.y.push(plane.y + plane.height/2);
	}
}

// returns true if boat catched parachuter at index p
function catchedPara(p) {
	return boat.x < parachuters.x[p] + parachuters.width && 
	boat.x + boat.width > parachuters.x[p] && 
	boat.y < parachuters.y[p] + parachuters.height && 
	boat.y + boat.height > parachuters.y[p];
}

// returns true if boat missed parachuter p
function missedPara(p) {
	return parachuters.y[p] + parachuters.height > canvas.height;
}

// removes first parachuter
function removePara() {
	parachuters.x.shift();
	parachuters.y.shift();
}

// checks if boat catched/missed a parachuter
function collisionDetection() {
	if(catchedPara(0)){
		score += 10
		removePara();
	}
	else if(missedPara(0)){
		if(--lives <= 0)
			gameOver = true;
		removePara();
	}
}

//resets game, life, and score counters
function playAgain() {
	gameOver = false;
	parachuters.x = [];
	parachuters.y = [];
	score = 0;
	lives = 3;
	boat.x = (canvas.width - boat.width)/ 2;
	plane.x = canvas.width;
}

//upper-left text bar (score and lives)
function dataBar() {
	contxt.fillStyle = "black";
	contxt.font = "20px Helvetica";
	contxt.textAlign = "left";
	contxt.fillText("Score: " + score, 10, 25);
	contxt.fillText("Lives: " + lives, 10, 50);
}

//text shown while not ingame
function menuText() {
	contxt.fillStyle = "black";
	contxt.textAlign = "center";
	contxt.font = "25px Helvetica";
	if(startScreen){
		contxt.fillText("Use arrow keys to move the boat and collect parachuters", 
		canvas.width/2, canvas.height/2);
	}else{
		contxt.fillText("GAME OVER!", canvas.width/2, canvas.height/4);
		contxt.fillText("FINAL SCORE: " + score, canvas.width/2, canvas.height/3);
	}	
	contxt.fillText("PRESS SPACE TO PLAY", canvas.width/2, canvas.height/1.5);
}

function drawObjects() {
	drawBackground();
	drawBoat();
	drawPlane();
	drawPara();
}

function moveObjects() {
	moveBoat();
	movePara();
	movePlane();
}

function draw(){
	contxt.clearRect(0, 0, canvas.width, canvas.height);
	if(!gameOver){
		drawObjects();
		dataBar();
		moveObjects();
		collisionDetection();
	}else{
		menuText();
	}
	requestAnimationFrame(draw);
}
//drops parachuter every interval
setInterval(dropPara, duration);
draw();


