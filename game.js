
var snack;

var freeLoaction = [];

var map;
var mapColumns = 32;
var mapRows = 32;
var mapWidth = 480;
var mapHeight = 480;

var cellHeight = mapHeight / mapRows;
var cellWidth = mapWidth / mapColumns;

var score;
var myScreen;
var ctx;

var food;

var gameSpeed;
var drawSpeed;
var maxRefreshCount;

var userLastAction;
var snakeLastMove;

var pixelStep;

function startGame() {
  myScreen = document.getElementById('mySnakeGame');
  ctx = myScreen.getContext("2d");
  myScreen.width = mapWidth;
  myScreen.height = mapHeight;

  startOver();

  setInterval(updateGame, gameSpeed);
  setInterval(drawGame, drawSpeed);

  document.onkeydown = canvasMove;
}

function startOver(){
  score = 0;
  document.getElementById('score_val').innerHTML = score;

  snack = [];
  snack[0] = [2, 5];
  snack[1] = [2, 6];
  snack[2] = [2, 7];

  food = [10, 10];

  userLastAction = 'R';
  snakeLastMove = 'R';

  gameSpeed = 200;
  drawSpeed = 20;

  pixelStep = 0;
}

function updateGame(){
  maxRefreshCount = gameSpeed/drawSpeed;
  calc();
}

function drawGame(){
  clear(ctx);
  drawSnake();
  drawFood();
  //drawMap();
}

function canvasMove(e) {
  if(e.keyCode == '38') { userLastAction = 'U'; }
  if(e.keyCode == '40') { userLastAction = 'D'; }
  if(e.keyCode == '37') { userLastAction = 'L'; }
  if(e.keyCode == "39") { userLastAction = 'R'; }
}

function drawMap(){
  for(c = 0; c < mapColumns; c++){
    ctx.beginPath();
    ctx.moveTo(c * cellWidth, 0);
    ctx.lineTo(c * cellWidth, mapWidth);
    ctx.stroke();
  }

  var cellHeight = mapHeight / mapRows;
  for(c = 0; c < mapRows; c++){
    ctx.beginPath();
    ctx.moveTo(0, c * cellHeight);
    ctx.lineTo(mapHeight, c * cellHeight);
    ctx.stroke();
  }
}

function calc(){
  var headSnake = snack[snack.length-1];
  var neckSnake = snack[snack.length-2];
  var nextHead;

  pixelStep = 0; //reset pixel step

  if(userLastAction == 'R'){
    nextHead = [headSnake[0], headSnake[1] + 1];
  }
  else if(userLastAction == 'L'){
    nextHead = [headSnake[0], headSnake[1] - 1];
  }
  else if(userLastAction == 'U'){
    nextHead = [headSnake[0] - 1, headSnake[1]];
  }
  else if(userLastAction == 'D'){
    nextHead = [headSnake[0] + 1, headSnake[1]];
  }

  //console.log('headSnake', headSnake);
  //Revert direction is impossible.
  if(nextHead[0] == neckSnake[0] && nextHead[1] == neckSnake[1]){
    userLastAction = snakeLastMove;
    return calc();
  }else{
    snack.push(nextHead);
    //if eating food.
    if(nextHead[0] == food[0] && nextHead[1] == food[1]){
      freeLoaction = calcFreeLocation();
      food = freeLoaction[Math.floor(Math.random()*freeLoaction.length)]; //set new food
      score += 1;
      document.getElementById('score_val').innerHTML = score;
    }else{
      snack.shift(); // first elem of arrays will be removed. * tail
    }

    snakeLastMove = userLastAction;
  }
}

function calcFreeLocation(){
  var newFreeLoaction = [];
  for(c=0;c<mapColumns;c++){
    for(r=0;r<mapRows;r++){
      var newLocation = [r, c];
      if(!isCoordnInArray(newLocation, newLocation)){
        newFreeLoaction.push(newLocation);
      }
    }
  }
  return newFreeLoaction;
}

function drawSnake(){
  //var calcPixelStep = (cellHeight/10) * pixelStep;
  ctx.fillStyle = 'rgba(0, 0, 0, .50)';
  for(s = 0; s<snack.length;s++){
    var drawLocation = [snack[s][1] * cellWidth, snack[s][0] * cellHeight];
    ctx.fillRect(drawLocation[0], drawLocation[1], cellWidth, cellHeight);

    if(s == snack.length-1){
      ctx.fillStyle = 'rgba(0, 0, 0, .6)';
      if(snakeLastMove == 'R'){
        drawLocation[0] += (cellWidth/maxRefreshCount) * pixelStep;
      }
      else if(snakeLastMove == 'L'){
        drawLocation[0] -= (cellWidth/maxRefreshCount) * pixelStep;
      }
      else if(snakeLastMove == 'U'){
        drawLocation[1] -= (cellHeight/maxRefreshCount) * pixelStep;
      }
      else if(snakeLastMove == 'D'){
        drawLocation[1] += (cellHeight/maxRefreshCount) * pixelStep;
      }
      ctx.fillRect(drawLocation[0], drawLocation[1], cellWidth, cellHeight);
    }
  }
  pixelStep += 1;
}

function drawFood(){
  ctx.fillStyle = 'rgba(255, 200, 0, .8)';
  ctx.fillRect(food[1] * cellWidth, food[0] * cellHeight, cellWidth, cellHeight);
}

function isCoordnInArray(array, coordn) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][0] == coordn[0] && array[i][1] == coordn[1]) {
            return true;   // Found it
        }
    }
    return false;   // Not found
}

function clear(c) {
    c.clearRect(0, 0, mapWidth, mapHeight);
}
