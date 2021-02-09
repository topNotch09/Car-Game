var PLAY = 1;
var END = 0;
var gameState = PLAY;

var thief, thief_running, thief_collided;
var ground, invisibleGround, groundImage;

var coinGroup, coinImage;
var obstaclesGroup, obstacle2, obstacle1,obstacle3;
var csong
var score=0;
var life = 11;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  thief_running = loadAnimation("Capture1.png");
  thief_collided = loadAnimation("thiefdead.png");
  groundImage = loadImage("backg.jpg");
  
  coinImage = loadImage("coin.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle3 = loadImage("obstacle3.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  csong = loadSound("coin.wav")
}

function setup() {
  createCanvas(600, 200);
  thief = createSprite(50,180,20,50);
  thief.addAnimation("running", thief_running);
  thief.scale = 0.5;
  
  ground = createSprite(0,190,1200,10);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  coinGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background("blue");
  textSize(20);
  fill(255);
  text("Score: "+ score, 500,40);
  text("life: "+ life , 500,60);
  drawSprites();
  if (gameState===PLAY){
   //score = score + Math.round(getFrameRate()/60);
    if(score >= 0){
      ground.velocityX = -6;
    }else{
      ground.velocityX = -(6 + 3*score/100);
    }
  
    if(keyDown("space") && thief.y >= 139) {
      thief.velocityY = -12;
    }
  
    thief.velocityY = thief.velocityY + 0.5  
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    thief.collide(ground);
    
    spawnCoin();
    spawnObstacles();
    
    if(coinGroup.isTouching(thief)){
      csong.play();
      score+=5
      coinGroup[0].destroy()
    }
  
   if(obstaclesGroup.isTouching(thief)){
        gameState = END;
     life -= 1;
    } 
  }
  
  else if (gameState === END ) {
    gameOver.visible = true;
    restart.visible = true;
    thief.addAnimation("collided", thief_collided);
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    thief.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    
    //change the trex animation
    thief.changeAnimation("collided",thief_collided);
    thief.scale =0.35;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)){
      if(life > 0){
        reset();
      }
    }
  }
}

function spawnCoin() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var coin = createSprite(600,120,40,10);
    coin.y = Math.round(random(80,120));
    coin.addImage(coinImage);
    coin.scale = 0.1;
    coin.velocityX = -3;
    
     //assign lifetime to the variable
    coin.lifetime = 200;
    
    //adjust the depth
    coin.depth = thief.depth;
    thief.depth = thief.depth + 1;
    
    //add each cloud to the group
    coinGroup.add(coin);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);    
    //generate random obstacles
    var rand = Math.round(random(1,3));
    switch(rand) {
      case 1: obstacle.addImage(obstacle2);
              break;
      case 2: obstacle.addImage(obstacle1);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
    }
        
    obstacle.velocityX = -(6 + 3*score/100);
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  coinGroup.destroyEach();
  
  thief.changeAnimation("running",thief_running);
  thief.scale =0.5;
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  
  score = 0;
  
}