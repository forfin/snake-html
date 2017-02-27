
var snake;

var freeLoaction = [];

var map;
var mapColumns = 64;
var mapRows = 48;
var mapWidth = 640;
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

var borderLocation = [];
for(c=0;c<mapRows;c++){
  borderLocation.push([c, -1]);
  borderLocation.push([c, mapColumns]);
}
for(c=0;c<mapColumns;c++){
  borderLocation.push([-1, c]);
  borderLocation.push([mapRows, c]);
}

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

  snake = [];

  var freeLoaction = calcFreeLocation();
  food = freeLoaction[Math.floor(Math.random()*freeLoaction.length)]; //set new food
  freeLoaction = calcFreeLocation();
  snake.push(freeLoaction[Math.floor(Math.random()*freeLoaction.length)]);

  var actionList = ['R', 'L', 'U', 'D'];
  var action = actionList[Math.floor(Math.random()*actionList.length)];

  userLastAction = action;
  snakeLastMove = action;

  gameSpeed = 80;
  drawSpeed = 20;

  pixelStep = 0;
}

function updateGame(){
  maxRefreshCount = gameSpeed/drawSpeed;
  calc();
}

function drawGame(){
  clear(ctx);
  drawMap();
  drawFood();
  drawSnake();
}

function canvasMove(e) {
  if(e.keyCode == '38') { userLastAction = 'U'; }
  if(e.keyCode == '40') { userLastAction = 'D'; }
  if(e.keyCode == '37') { userLastAction = 'L'; }
  if(e.keyCode == "39") { userLastAction = 'R'; }
}

function drawMap(){
  ctx.strokeStyle="#F2F2F2";
  for(c = 0; c < mapColumns; c++){
    ctx.beginPath();
    ctx.moveTo(c * cellWidth + 0.5, .5);
    ctx.lineTo(c * cellWidth + 0.5, mapHeight + 0.5);
    ctx.stroke();
  }
  for(c = 0; c < mapRows; c++){
    ctx.beginPath();
    ctx.moveTo(.5, c * cellHeight + 0.5);
    ctx.lineTo(mapWidth + 0.5, c * cellWidth + 0.5);
    ctx.stroke();
  }
}

function calc(){
  if(snake.length == 1){
    var neckSnake = [];
  }else{
    var neckSnake = snake[snake.length-2];
  }
  var headSnake = snake[snake.length-1];
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
    //console.log('nextHead', nextHead);
    userLastAction = snakeLastMove;
    return calc();
  }else{
    //console.log(borderLocation);
    var deathLocation = snake.concat(borderLocation);
    if(isCoordnInArray(deathLocation, nextHead)){
      console.log('Game Over');
    }else{
      snake.push(nextHead);
      //if eating food.
      if(nextHead[0] == food[0] && nextHead[1] == food[1]){
        freeLoaction = calcFreeLocation();
        food = freeLoaction[Math.floor(Math.random()*freeLoaction.length)]; //set new food
        score += 1;
        document.getElementById('score_val').innerHTML = score;
      }else{
        snake.shift(); // first elem of arrays will be removed. * tail
      }
    }


    snakeLastMove = userLastAction;
  }
}

function calcFreeLocation(){
  var newFreeLoaction = [];
  for(c=0;c<mapColumns;c++){
    for(r=0;r<mapRows;r++){
      var newLocation = [r, c];
      if(!isCoordnInArray(snake, newLocation)){
        newFreeLoaction.push(newLocation);
      }
    }
  }
  return newFreeLoaction;
}

function drawSnake(){
  //var calcPixelStep = (cellHeight/10) * pixelStep;
  ctx.fillStyle = '#40596B';
  for(s = 0; s<snake.length;s++){
    var drawLocation = [snake[s][1] * cellWidth, snake[s][0] * cellHeight];
    ctx.fillRect(drawLocation[0], drawLocation[1], cellWidth, cellHeight);

    if(s == snake.length-1){
      ctx.fillStyle = '#FF7058';
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
  ctx.fillStyle = '#FFD15C';
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
