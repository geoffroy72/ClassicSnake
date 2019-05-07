// START GAME BUTTON
let startGameHandler = document.getElementById('start-game');

startGameHandler.addEventListener('click', function(){
  document.getElementById('startscreen').className="d-none";
});

document.onkeydown = checkstart;

function checkstart(e){
  if(e.keyCode === 13){
    document.getElementById('startscreen').className="d-none";
    launchGame();
  }
}

// START GAME 
function launchGame(){

  // CREATE CANVAS
  document.getElementById('canvas').className = "d-block";
  const canvas = document.querySelector('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  document.body.insertBefore(canvas, document.body.childNodes[0]);

  let snakeOrientation = 0; 
  let shifter = {};
  let interval;

  // SNAKE SETTINGS
  let snake = { 
    height: 25,
    width: 25,
    backgroundColor : "red"
  };

  let snakeCoordinates = [
    { x : Math.floor(canvas.width/2), y : Math.floor(canvas.height/2) },
    { x : Math.floor(canvas.width/2), y : Math.floor(canvas.height/2) + snake.width },
    { x : Math.floor(canvas.width/2), y : Math.floor(canvas.height/2) + snake.width*2 },
  ];

  //GENERATE FOOD
  let blueFoodCoordinates = { 
    x : Math.floor(Math.random()*canvas.width - 20),
    y : Math.floor(Math.random()*canvas.height - 20)
  };

  let blueFoodCollisionCoordinates = {
    x : blueFoodCoordinates.x - 14,
    y : blueFoodCoordinates.y - 14
  };

  let redFoodCoordinates = {
    x : Math.floor(Math.random()*canvas.width - 20),
    y : Math.floor(Math.random()*canvas.height - 20)
  };

  let redFoodCollisionCoordinates = {
    x : redFoodCoordinates.x - 14,
    y : redFoodCoordinates.y - 14
  };

  // DRAW SNAKE
  function drawSnake() {
    for(let i = 0; i < snakeCoordinates.length; i++){
      ctx.fillStyle = snake.backgroundColor;
      ctx.fillRect(snakeCoordinates[i].x, snakeCoordinates[i].y, snake.width, snake.height);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 5;
      ctx.strokeRect(snakeCoordinates[i].x, snakeCoordinates[i].y, snake.width, snake.height);
    }
  }


  // GENERATE BORDERS
  function border() {
    ctx.fillStyle = '#ccccb3';
    ctx.save();
    ctx.fillRect(0, 0, 20, canvas.height);
    ctx.fillRect(0, 0, canvas.width, 20);
    ctx.fillRect(canvas.width, 0, -20, canvas.height);
    ctx.fillRect(0, canvas.height, canvas.width, -20);
  }

  // GENERATE TOP BRICK LINE
  function brickLineTop() {
    ctx.fillStyle = '#000';
    ctx.save();
    ctx.fillRect(0, 0, canvas.width, 2);
    ctx.fillRect(0, 6, canvas.width, 2);
    ctx.fillRect(0, 12, canvas.width, 2);
    ctx.fillRect(0, 18, canvas.width, 2);
  }

  // GENERATE BOTTOM BRICK LINE 
  function brickLineBottom() {
    ctx.fillStyle = '#000';
    ctx.save();
    ctx.fillRect(0, canvas.height - 2, canvas.width, 2);
    ctx.fillRect(0, canvas.height - 8, canvas.width, 2);
    ctx.fillRect(0, canvas.height - 14, canvas.width, 2);
    ctx.fillRect(0, canvas.height - 20, canvas.width, 2);
  }

  // GENERATE RIGHT BRICK LINE
  function brickLineRight() {
    let line = 6;
    let row = 12;
    for(let i = 1; i <= canvas.height; i++) {
      ctx.fillStyle = '#000';
      ctx.save();
      ctx.fillRect(0, (0 + line)*i, 20, 2);
    }
    for(let i = 2; i <= canvas.height; i++) {
      ctx.fillRect(canvas.width - 5, (6 + line)*i, 2, 6);
      ctx.fillRect(canvas.width - 12, (6 + line)*i, 2, 6);
    }
    for( let i = 0; i <= canvas.height; i++) {
      ctx.fillRect(canvas.width - 8, 20 + (row*i), 2, 6);
    }
    ctx.fillRect(canvas.width - 20, 20, 2, canvas.height - 40);
  }

  // GENERATE LEFT BRICK LINE
  function brickLineLeft() {
    let line = 6;
    let row = 12;
    for(let i = 1; i <= canvas.height; i++) {
      ctx.fillStyle = '#000';
      ctx.save();
      ctx.fillRect(canvas.width - 20, (0 + line)*i, 20, 2);
    }
    for(let i = 2; i <= canvas.height; i++) {
      ctx.fillRect(5, (6 + line)*i, 2, 6);
      ctx.fillRect(12, (6 + line)*i, 2, 6);
    }
    for( let i = 0; i <= canvas.height; i++) {
      ctx.fillRect(8, 20 + (row*i), 2, 6);
    }
    ctx.fillRect(20, 20, 2, canvas.height - 40);
  }

  // GENERATE TOP BRICK PATTERN
  function generateBrickTop() {
    let row = 12;
    for(let i = 1; i <= canvas.width; i++) {
      ctx.fillStyle = '#000';
      ctx.save();
      ctx.fillRect((6 + row)*i, 0, 2, 6);
      ctx.fillRect((0 + row)*i, 6, 2, 6);
      ctx.fillRect((6 + row)*i, 12, 2, 6);
    }
  }

  // GENERATE BOTTOM BRICK PATTERN 
  function generateBrickBottom() {
    let row = 12;
    for(let i = 1; i <= canvas.width; i++) {
      ctx.fillStyle = '#000';
      ctx.save();
      ctx.fillRect((6 + row)*i, canvas.height - 8, 2, 6);
      ctx.fillRect((0 + row)*i, canvas.height - 14, 2, 6);
      ctx.fillRect((6 + row)*i, canvas.height - 20, 2, 6);
    }
  }

  // CLEAR CANVAS
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // MOVES EVENTS
  document.onkeydown = checkKey;

  function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38' && snakeOrientation !== 1) {
      snakeOrientation = 0;
    } else if (e.keyCode == '40' && snakeOrientation !== 0) {
      snakeOrientation = 1;
    } else if (e.keyCode == '37' && snakeOrientation !== 3) {
      snakeOrientation = 2;
    } else if (e.keyCode == '39' && snakeOrientation !== 2) {
      snakeOrientation = 3;
    }
    if(e.keyCode == '32'){
      if(snake.backgroundColor === 'red'){
        snake.backgroundColor = 'blue';
      } else {
        snake.backgroundColor = 'red';
      }
    }
  }

  function initializeInterval(){
    interval = setInterval(launchInterval, 120);
  }

  // MOVEMENTS UPDATE + REFRESH CANVAS/SNAKE/FOOD
  function launchInterval(){
    update();
    border();
    brickLineTop();
    brickLineBottom();
    brickLineRight();
    brickLineLeft();
    generateBrickTop();
    generateBrickBottom();
    drawSnake();
    generateFood(redFoodCoordinates, "red");
    generateFood(blueFoodCoordinates, "blue");
    movesAndCollide();
  }

  initializeInterval();

  function movesAndCollide(){
    if(snakeOrientation === 0){
      shifter = snakeCoordinates.pop();
      shifter.y = snakeCoordinates[0].y - snake.height;
      shifter.x = snakeCoordinates[0].x;
      selfCollide(shifter);
      if(shifter.y <= 20){
        endGame();
      } else {
        collidRules();
        return snakeCoordinates.unshift(shifter);
      }
    } else if(snakeOrientation === 1){
      shifter = snakeCoordinates.pop();
      shifter.y = snakeCoordinates[0].y + snake.height;
      shifter.x = snakeCoordinates[0].x;
      selfCollide(shifter);
      if(shifter.y >= canvas.height - 20){
        endGame();
      } else {
        collidRules();
        return snakeCoordinates.unshift(shifter);
      }
    } else if(snakeOrientation === 2){
      shifter = snakeCoordinates.pop();
      shifter.x = snakeCoordinates[0].x - snake.width;
      shifter.y = snakeCoordinates[0].y;
      selfCollide(shifter);
      if(shifter.x <= 20){
        endGame();
      } else {
        collidRules();
        return snakeCoordinates.unshift(shifter);
      }
    } else if(snakeOrientation === 3){
      shifter = snakeCoordinates.pop();
      shifter.x = snakeCoordinates[0].x + snake.width;
      shifter.y = snakeCoordinates[0].y;
      selfCollide(shifter);
      if(shifter.x >= canvas.width - 38){
        endGame();
      } else {
        collidRules();
        return snakeCoordinates.unshift(shifter);
      }
    }
  }

  function selfCollide(block){
    for(let n = 0 ; n < snakeCoordinates.length -1 ; n++){
      if( block.x === snakeCoordinates[n].x &&
          block.y === snakeCoordinates[n].y 
        ){
          endGame();
      }
    }
  }

  function collidRules(){
    if(
      shifter.y <= blueFoodCollisionCoordinates.y + 28 && 
      shifter.y >= blueFoodCollisionCoordinates.y - 28 &&
      shifter.x <= blueFoodCollisionCoordinates.x + 28 &&
      shifter.x >= blueFoodCollisionCoordinates.x - 28 &&
      snake.backgroundColor === "blue"
      ){
      foodCollision("blue");
      generateFood(blueFoodCoordinates, "blue");
      generateNewBlock();
    } else if(
      shifter.y <= redFoodCollisionCoordinates.y + 28 && 
      shifter.y >= redFoodCollisionCoordinates.y - 28 &&
      shifter.x <= redFoodCollisionCoordinates.x + 28 &&
      shifter.x >= redFoodCollisionCoordinates.x - 28 &&
      snake.backgroundColor === "red"
    ){
      foodCollision("red");
      generateFood(redFoodCoordinates, "red");
      generateNewBlock();
    } else if(
      shifter.y <= blueFoodCollisionCoordinates.y + 28 && 
      shifter.y >= blueFoodCollisionCoordinates.y - 28 &&
      shifter.x <= blueFoodCollisionCoordinates.x + 28 &&
      shifter.x >= blueFoodCollisionCoordinates.x - 28 &&
      snake.backgroundColor === "red"
    ){
      endGame();
    } else if(
      shifter.y <= redFoodCollisionCoordinates.y + 28 && 
      shifter.y >= redFoodCollisionCoordinates.y - 28 &&
      shifter.x <= redFoodCollisionCoordinates.x + 28 &&
      shifter.x >= redFoodCollisionCoordinates.x - 28 &&
      snake.backgroundColor === "blue"
    ){
      endGame();
    }
  }

  function foodCollision(color){
    if(color === "red"){
      redFoodCoordinates.y = Math.floor(Math.random()*canvas.height - 20);
      redFoodCoordinates.x = Math.floor(Math.random()*canvas.width - 20);
      redFoodCollisionCoordinates.x = redFoodCoordinates.x - 14;
      redFoodCollisionCoordinates.y =  redFoodCoordinates.y - 14;
    } else if(color === "blue"){
      blueFoodCoordinates.y = Math.floor(Math.random()*canvas.height - 20);
      blueFoodCoordinates.x = Math.floor(Math.random()*canvas.width - 20);
      blueFoodCollisionCoordinates.x = blueFoodCoordinates.x - 14;
      blueFoodCollisionCoordinates.y =  blueFoodCoordinates.y - 14;
    }
  }

  function generateNewBlock(){
    if(snakeOrientation === 0){
      let newBlock = { x : snakeCoordinates[snakeCoordinates.length - 1].x,y : snakeCoordinates[snakeCoordinates.length - 1].y + 25 };
      snakeCoordinates.push(newBlock);
    } else if( snakeOrientation === 1){
      let newBlock = { x : snakeCoordinates[snakeCoordinates.length - 1].x,y : snakeCoordinates[snakeCoordinates.length - 1].y - 25 };
      snakeCoordinates.push(newBlock);
    } else if( snakeOrientation === 2){
      let newBlock = { x : snakeCoordinates[snakeCoordinates.length - 1].x + 25 ,y : snakeCoordinates[snakeCoordinates.length - 1].y };
      snakeCoordinates.push(newBlock);
    } else if( snakeOrientation === 3){
      let newBlock = { x : snakeCoordinates[snakeCoordinates.length - 1].x - 25,y : snakeCoordinates[snakeCoordinates.length - 1].y };
      snakeCoordinates.push(newBlock);
    }
  }

  function generateFood(food, color){
    if(color === "red"){
      if(
        food.x <= blueFoodCoordinates.x + 25 &&
        food.x >= blueFoodCoordinates.x - 25 &&
        food.y <= blueFoodCoordinates.y + 25 &&
        food.y >= blueFoodCoordinates.y - 25 ||
        food.x <= 32.5 || food.y <= 32.5
        ){
        foodCollision(color);
        generateFood(food, color);
      }
    } else if(color === "blue"){
      if(
        food.x <= redFoodCoordinates.x + 25 &&
        food.x >= redFoodCoordinates.x - 25 &&
        food.y <= redFoodCoordinates.y + 25 &&
        food.y >= redFoodCoordinates.y - 25 ||
        food.x <= 32.5 || food.y <= 32.5
        ){
        foodCollision(color);
        generateFood(food, color);
      }
    }
    ctx.beginPath(); 
    ctx.arc(food.x, food.y, 12.5, 0, Math.PI * 2, true);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  function endGame(){
    clearInterval(interval);
  }
}