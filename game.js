function SnakeGame(){

  var snake;

  var map;
  var mapColumns;
  var mapRows;
  var mapWidth;
  var mapHeight;

  var cellHeight = 24;
  var cellWidth = 24;

  var score;
  var myScreen;
  var ctx;

  var food;

  var gameSpeed;
  var drawSpeed;
  var maxRefreshCount;

  var userLastAction;
  var snakeLastMove;

  var borderLocation;


  var pixelStep;

  this.resize = function(){
    mapWidth = window.innerWidth - 100;
    mapHeight = window.innerHeight - 160;
    mapColumns = parseInt(mapHeight / cellHeight);
    mapRows = parseInt(mapWidth / cellWidth);
    mapWidth = mapRows * cellWidth;
    mapHeight = mapColumns * cellHeight;

    myScreen = document.getElementById('mySnakeGame');
    ctx = myScreen.getContext("2d");
    myScreen.width = mapWidth;
    myScreen.height = mapHeight;

    borderLocation = [];
    for(c=0;c<mapRows;c++){
      borderLocation.push([-1, c]);
      borderLocation.push([mapColumns, c]);
    }
    for(c=0;c<mapColumns;c++){
      borderLocation.push([c, -1]);
      borderLocation.push([c, mapRows]);
    }

    this.startOver();
  }

  this.startGame = function() {

    this.resize();


    setInterval(updateGame, gameSpeed);
    //setInterval(drawGame, drawSpeed);

    document.onkeydown = canvasMove;
  }

  this.startOver = function(){
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

    gameSpeed = 120;

    pixelStep = 0;
  }

  this.getSnake = function(){
    return snake;
  }

  this.getFood = function(){
    return food;
  }

  this.getFreeLocation = function(){
    return calcFreeLocation();
  }

  this.getUserLastAction = function(){
    return userLastAction;
  }

  this.setUserLastAction = function(action){
    userLastAction = action;
  }

  function updateGame(){
    maxRefreshCount = gameSpeed/drawSpeed;
    calc();
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
      ctx.moveTo(.5, c * cellHeight + 0.5);
      ctx.lineTo(mapWidth + 0.5, c * cellHeight + 0.5);
      ctx.stroke();
    }
    for(c = 0; c < mapRows; c++){
      ctx.beginPath();
      ctx.moveTo(c * cellWidth + 0.5, .5);
      ctx.lineTo(c * cellWidth + 0.5, mapHeight + 0.5);
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
        //console.log('Game Over');
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
        var newLocation = [c, r];
        if(!isCoordnInArray(snake, newLocation)){
          newFreeLoaction.push(newLocation);
        }
      }
    }
    return newFreeLoaction;
  }

  function drawSnake(){
    //var calcPixelStep = (cellHeight/10) * pixelStep;

    var reverseSnake = snake.slice(0);
    reverseSnake.reverse();
    var drawSnake = [reverseSnake, snake];
    //ctx.fillStyle = 'rgba(0,0,0,0.1)';
    for(r = 0; r<drawSnake.length;r++){
      for(s = 0; s<snake.length;s++){
        var drawLocation = [drawSnake[r][s][1] * cellWidth + 0.1 * cellWidth, drawSnake[r][s][0] * cellHeight + 0.1 * cellHeight];


        if(s+1 < snake.length){
          var stopLocation = [drawSnake[r][s+1][1] * cellWidth + 0.9 * cellWidth, drawSnake[r][s+1][0] * cellHeight + 0.9 * cellHeight];

          ctx.fillStyle = '#40596B';
          ctx.beginPath();
          ctx.moveTo(Math.min(drawLocation[0], stopLocation[0]), Math.min(drawLocation[1], stopLocation[1]));
          ctx.lineTo(Math.min(drawLocation[0], stopLocation[0]), Math.max(drawLocation[1], stopLocation[1]));
          ctx.lineTo(Math.max(drawLocation[0], stopLocation[0]), Math.max(drawLocation[1], stopLocation[1]));
          ctx.lineTo(Math.max(drawLocation[0], stopLocation[0]), Math.min(drawLocation[1], stopLocation[1]));
          ctx.closePath();
          ctx.fill();
        }else if(r == 1){
          ctx.fillStyle = '#FF7058';
          ctx.fillRect(drawLocation[0], drawLocation[1], cellWidth * 0.8, cellHeight * 0.8);
        }
      }
    }

    pixelStep += 1;
  }

  function drawFood(){
    ctx.fillStyle = '#FFD15C';
    ctx.fillRect(food[1] * cellWidth + cellWidth * 0.25, food[0] * cellHeight + cellHeight * 0.25, cellWidth * 0.5, cellHeight * 0.5);
  }

  function clear(c) {
      c.clearRect(0, 0, mapWidth, mapHeight);
  }
}

function isCoordnInArray(array, coordn) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][0] == coordn[0] && array[i][1] == coordn[1]) {
            return true;   // Found it
        }
    }
    return false;   // Not found
}

var game = new SnakeGame();

window.addEventListener("resize", game.resize);
