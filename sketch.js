var PLAY = 1;
var INTRO = 2;
var END = 0;
var gameState = INTRO;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup,
  obstacle1,
  obstacle2,
  obstacle3,
  obstacle4,
  obstacle5,
  obstacle6;

var score, hiscore;
var gameOverImg, restartImg;
var jumpSound, checkPointSound, dieSound, gameOver2;
var bgImg, bgImg;
var playerCount = 0;

function preload() {
  trex_running = loadAnimation(
    "images/trex/dino1.png",
    "images/trex/dino2.png",
    "images/trex/dino3.png",
    "images/trex/dino4.png",
    "images/trex/dino5.png",
    "images/trex/dino6.png"
  );
  trex_collided = loadAnimation("images/trex/dino-collided.png");

  groundImage = loadImage("images/ground2.png");

  cloudImage = loadImage("images/cloud.png");

  obstacle1 = loadImage("images/obstacle/obstacle11.png");
  obstacle2 = loadImage("images/obstacle/obstacle21.png");
  obstacle3 = loadImage("images/obstacle/obstacle31.png");
  obstacle4 = loadImage("images/obstacle/obstacle41.png");
  obstacle5 = loadImage("images/obstacle/obstacle51.png");
  obstacle6 = loadImage("images/obstacle/obstacle61.png");

  obstacle1d = loadImage("images/obstacle/obstacle1.png");
  obstacle2d = loadImage("images/obstacle/obstacle2.png");
  obstacle3d = loadImage("images/obstacle/obstacle3.png");
  obstacle4d = loadImage("images/obstacle/obstacle4.png");
  obstacle5d = loadImage("images/obstacle/obstacle5.png");
  obstacle6d = loadImage("images/obstacle/obstacle6.png");

  bgImg = loadImage("images/bg.jpg");
  bg2Img = loadImage("images/bg2.jpg");
//bg3Img = loadImage("images/bg3.jpg");
  bg4Img = loadImage("images/bg4.jpg");
  bg5Img = loadImage("images/bg5.jpg");
  bg6Img = loadImage("images/bg6.jpg");

  restartImg = loadImage("images/restart.png");
  gameOverImg = loadImage("images/gameOver.png");

  jumpSound = loadSound("sounds/jump.mp3");
  dieSound = loadSound("sounds/die.mp3");
  checkPointSound = loadSound("sounds/checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  database = firebase.database();

  ground = createSprite(camera.position.x, 180, 200, 20);
  ground.addImage("ground", groundImage);
  ground.velocityX = -(6 + (3 * score) / 100);

  form = new Form();

  trex = createSprite(0, 160, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);

  trex.scale = 0.5;

  restart = createSprite(300, 140);
  restart.addImage(restartImg);

  //gameOver.scale = 0.5;
  restart.scale = 0.5;

  invisibleGround = createSprite(camera.x, 190, width, 10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  trex.setCollider("circle", 0, 0, 100);
  trex.debug = false;

  gameOver2 = createSprite(camera.position.x, camera.position.y - 100);
  gameOver2.addImage(gameOverImg);
  gameOver2.visible = false;

  score = 0;
  hiscore = 0;
}

function draw() {
  
  gameOver2.visible = false;
  background(180);
  
  camera.position.x = trex.x + 300;
  camera.position.y = trex.y; 

  invisibleGround.x = camera.x;
  ground.x = camera.x;

 
  if (gameState === INTRO) {
    background(bgImg);
    player = new Player();
    player.getCount();
    player.index = playerCount;
    
    console.log("intro");
    form.display();

    gameOver2.visible = false;
    restart.visible = false;
    trex.visible = false;
    ground.visible = false;
    textSize(20);
    fill(0);
   
    //change the trex animation
    trex.changeAnimation("collided", trex_collided);
    
    // ground.velocityX = 0;
    trex.velocityY = 0;

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
  
  
  } else if (gameState === PLAY) {
    //background(bgImg);

    trex.changeAnimation("running", trex_running);
   // if (score > 200) {
      background(bg4Img);
    //}
    if (score > 400) {
      background(bg5Img);
    }
    if (score > 600) {
      background(bg6Img);
    }

    if (score > 800) {
      background(bg4Img);
    }
    if (score > 1000) {
      background(bg5Img);
    }
    if (score > 1200) {
      background(bg6Img);
    }

    gameOver2.visible = false;
    restart.visible = false;
    trex.visible = true;
    bgImg.visible = false;
    ground.visible = true;
    ground.x = width / 2;

    if (ground.x < camera.position.x) {
      ground.x = camera.position.x;
    }
    ground.velocityX = -(6 + (3 * score) / 100);

    trex.velocityX = 10;
    //scoring
    score = score + Math.round(getFrameRate() / 60);
    if (score > 0 && score % 100 === 0) {
      checkPointSound.play();
    }

    //jump when the space key is pressed
    if (keyDown("space") && trex.y >= 120) {
      trex.velocityY = -12;
      jumpSound.play();
    }

    //add gravity
    trex.velocityY = trex.velocityY + 0.8;

    //spawn the clouds
    spawnClouds();

    //spawn obstacles on the ground
    spawnObstacles();

    if (trex.isTouching(obstaclesGroup)) {
      //trex.velocityY = -12;
      jumpSound.play();
      gameState = END;
      dieSound.play();
    }
  
  
  } else if (gameState === END) {
    background(bg2Img);
    gameOver2 = createSprite(camera.position.x, camera.position.y - 100);
    gameOver2.addImage(gameOverImg);
    gameOver2.visible = true;
    restart.visible = true;
 
    trex.changeAnimation("collided", trex_collided);
  

    if (score > hiscore) {
      hiscore = score;
    }
    player.score = hiscore;

    player.update();

    trex.velocityY = 0;
    trex.velocityX = 0;


    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    if (keyDown("space")) {
      reset();
    }
  }

  //stop trex from falling down
  
  trex.collide(invisibleGround);

  if (mousePressedOver(restart)) {
    reset();
  }

  drawSprites();

  
  if (gameState === PLAY || gameState === END) {
    fill("#F6DF8F");
    textSize(20);
    text("Score: " + score, camera.position.x - 150, height - height - 100);

    text("Hi Score: " + hiscore, camera.position.x + 20, height - height - 100);
  }

  if(gameState === END){
    fill("yellow")
    text("Press 'space' to start",camera.position.x-100,camera.position.y)
  }
}

function reset() {
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
  trex.changeAnimation("running", trex_running);
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(camera.position.x + 500, 165, 10, 40);


    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;

    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(
      camera.position.x + 700,
      camera.position.y - 500,
      40,
      10
    );
    cloud.y = Math.round(random(0, 30));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    //cloud.velocityX = -3;

    //assign lifetime to the variable
    cloud.lifetime = 200;

    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
