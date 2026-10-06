

let numBoxes = 6; 

let boxWidth = 120;
let boxHeight = 60;


let cols = 3;          
let rows = 2;          


let boxStartX = 110;
let boxStartY = 120;


let boxGapX = 35;
let boxGapY = 25;

// bombs
let bombIndices = [];  // array of bomb positions
let bombsCount = 1;    // how many bombs this round

let score = 0;
let gameOver = false;

let messageText = "Click a box. Avoid the bombs!";

let gameOverOverlay;

// for red flash when bomb is clicked
let flashFrames = 0;

function setup() {
  let canvas = createCanvas(600, 450);
  canvas.parent("game-area");

  gameOverOverlay = document.getElementById("game-over-overlay");

  pickNewBombs();
}

function draw() {
  // background: normal grey, or red flash when bomb hit
  if (flashFrames > 0) {
    background(255, 210, 210);
    flashFrames = flashFrames - 1;
  } else {
    background(240);
  }

  // greeting
  textSize(18);
  textAlign(LEFT);
  fill(30, 40, 120); 
  text("DONT MAKE THE WRONG CHOICE", 10, 25);

  // score
  textSize(16);
  fill(20, 120, 40); 
  text("Score: " + score, 10, 50);

  // bombs count
  fill(150, 30, 30); 
  text("Bombs this round: " + bombsCount, 10, 70);

  
  fill(0);
  text(messageText, 10, 95);

  drawBoxes();
}

function drawBoxes() {
  for (let i = 0; i < numBoxes; i = i + 1) {
    let col = i % cols;            
    let row = floor(i / cols);     

    let x = boxStartX + col * (boxWidth + boxGapX);
    let y = boxStartY + row * (boxHeight + boxGapY);

  
    let over =
      mouseX > x && mouseX < x + boxWidth &&
      mouseY > y && mouseY < y + boxHeight &&
      gameOver == false;

    stroke(80);
    strokeWeight(2);

    if (over) {
      
      fill(210, 235, 255);
    } else {
      fill(200, 220, 255);
    }

    rect(x, y, boxWidth, boxHeight, 12);

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(20);
    text(i + 1, x + boxWidth / 2, y + boxHeight / 2);
  }
}

function mousePressed() {
  if (gameOver == true) {
    resetGame();
    return;
  }

  for (let i = 0; i < numBoxes; i = i + 1) {
    let col = i % cols;
    let row = floor(i / cols);

    let x = boxStartX + col * (boxWidth + boxGapX);
    let y = boxStartY + row * (boxHeight + boxGapY);

    let insideX = mouseX > x && mouseX < x + boxWidth;
    let insideY = mouseY > y && mouseY < y + boxHeight;

    if (insideX && insideY) {
      handleChoice(i);
      break;
    }
  }
}

function handleChoice(index) {
  if (isBomb(index) == true) {
    messageText = "Boom! You clicked a bomb.";
    gameOver = true;

    // start flash effect
    flashFrames = 15;

    if (gameOverOverlay != null) {
      gameOverOverlay.style.display = "flex";
    }
  } else {
    score = score + 1;
    messageText = "Safe! Your score is now " + score + ".";
    pickNewBombs();
  }
}


function isBomb(index) {
  for (let i = 0; i < bombIndices.length; i = i + 1) {
    if (bombIndices[i] == index) {
      return true;
    }
  }
  return false;
}

function pickNewBombs() {
  
  if (score >= 10) {
    bombsCount = 3;
  } else if (score >= 5) {
    bombsCount = 2;
  } else {
    bombsCount = 1;
  }

  bombIndices = [];

  // pick different random boxes for bombs
  while (bombIndices.length < bombsCount) {
    let r = floor(random(0, numBoxes));

    let alreadyUsed = false;
    for (let i = 0; i < bombIndices.length; i = i + 1) {
      if (bombIndices[i] == r) {
        alreadyUsed = true;
      }
    }

    if (alreadyUsed == false) {
      bombIndices.push(r);
    }
  }
}

function resetGame() {
  score = 0;
  gameOver = false;
  messageText = "Click a box. Avoid the bombs!";
  flashFrames = 0;
  pickNewBombs();

  if (gameOverOverlay != null) {
    gameOverOverlay.style.display = "none";
  }
}
