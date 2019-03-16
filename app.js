//Aliases
const Application = PIXI.Application,
      Container = PIXI.Container,
      Text = PIXI.Text,
      TextStyle = PIXI.TextStyle,
      loader = PIXI.loader,
      resources = PIXI.loader.resources,
      Texture = PIXI.Texture;
      TextureCache = PIXI.utils.TextureCache,
      Sprite = PIXI.Sprite,
      Rectangle = PIXI.Rectangle;

let w = window.innerWidth;
let h = window.innerHeight;

//Create a Pixi Application
const app = new Application({
    width: w, 
    height: h,
    autoResize: true,
    resolution: 1
    }
);

//Add the canvas that Pixi automatically created for you to the HTML document
let container = document.getElementById("container");
container.appendChild(app.view);

//load sprite and assign them a name
loader
    .add("buttonPlay", "resources/sprite/play-button.png")
    .add("buttonAbout", "resources/sprite/about-button.png")
    .add("buttonPause", "resources/sprite/pause-button.png")
    .add("player", "resources/sprite/player.png")
    .add("enemy", "resources/sprite/enemy.png")
    .add("buttonRestart", "resources/sprite/restart-button.png")
    .add("buttonMenu", "resources/sprite/menu-button.png")
    .load(setup);

//variable declaration
let state, title, scoreLabel, scoreMultiplierLabel, gameOverLabel, textStyle, player, playerMoveSpeed,
    endTitle, endScoreLabel, endScoreMultiplierLabel, restartButtonContainer, restartButton, restartLabel;
let mmTitle, mmBtnContainer, mmBtnPlay, mmPlayLabel, mmBtnAbout, mmAboutLabel, mmBtn, mmLabel,
    aboutParagraph, aboutBtnContainer, btnBack, btnBackLabel, pauseButtonContainer, pauseButton,
    pauseButtonLabel, pauseMenuBtnContainer, pauseMenuLabel, continueBtn, continueBtnLabel, mmBtn_2, mmLabel_2;
var gameScene, score, scoreMultiplier, enemy, enemyIsAlive, enemySize, minSpawnX, maxSpawnX, spawnY,
    gameOverScene;
var mainMenuScene, aboutScene, pauseMenu, halfOfRendererWidth, menuTitleY, menuFirstBtnY, menuSecondBtnY,
    ingameTitleX, scoreMultiplierX, scoreX, topLabelY, pauseBtnLabelX, pauseBtnLabelY, pauseBtnX, pauseBtnY,
    mmBtnY;

//initial setup for the whole app
function setup() {

    if (w <= 500 && h <= 500) {
        //don't do anything;
    } else {

        app.renderer.resize(500, 500);
        w = 500;
        h = 500;

    }

    //my attempt at making this responsive by converting to their % values
    //center value
    halfOfRendererWidth = app.renderer.width / 2;
    //position value of Y for label on menus
    menuTitleY = Math.round(app.renderer.height / 3.33);
    //position value of Y for the 1st button in a list of buttons on menus
    menuFirstBtnY = app.renderer.height / 2.5;
    //position value of Y for the 2nd button in a list of buttons on menus
    menuSecondBtnY = (app.renderer.height / 2) - 5;
    //position value of X for score multipliers
    scoreMultiplierX = app.renderer.width / 2.127659574468085;
    //position value of X for title ingame screen
    ingameTitleX = app.renderer.width / 25;
    //position value of Y for labels close to the top of screen
    topLabelY = app.renderer.height / 50;
    //position value of X for score
    scoreX = app.renderer.width / 1.25;
    //position value of X for pause button label
    pauseBtnLabelX = app.renderer.width / 7.142857142857143;
    //position value of Y for pause button label
    pauseBtnLabelY = app.renderer.height / 1.162790697674419;
    //position value of Y for main menu button
    mmBtnY = app.renderer.height / 1.666666666666667;
    //position value of X for pause button
    pauseBtnX = app.renderer.width / 8.333333333333333;
    //position value of Y for pause button
    pauseBtnY = app.renderer.height / 1.162790697674419;

    // initialize
    mainMenuScene = new Container();
    mmBtnContainer = new Container();
    aboutScene = new Container();
    aboutBtnContainer = new Container();
    gameScene = new Container();
    pauseMenu = new Container();
    pauseButtonContainer = new Container();
    pauseMenuBtnContainer = new Container();
    gameOverScene = new Container();
    restartButtonContainer = new Container();
    aboutScene.visible = false;
    pauseMenu.visible = false;
    gameScene.visible = false;
    gameOverScene.visible = false;
    restartButtonContainer.visible = false;
    score = 0;
    scoreMultiplier = 1;

    textStyle = new TextStyle({

        fontFamily: "Arial",
        fontSize: 18,
        fill: "white",
        fontWeight: "bold"

    });

    mmTitle = new Text("Flydra", textStyle);
    mmTitle.position.set(halfOfRendererWidth, menuTitleY);
    mmTitle.anchor.set(0.5, 0.5);
    mmPlayLabel = new Text("Play", textStyle);
    mmPlayLabel.position.set(halfOfRendererWidth, menuFirstBtnY);
    mmPlayLabel.anchor.set(0.5, 0.5);
    mmAboutLabel = new Text("About", textStyle);
    mmAboutLabel.position.set(halfOfRendererWidth, menuSecondBtnY);
    mmAboutLabel.anchor.set(0.5, 0.5);
    aboutParagraph = new Text("Fly Hydra/Flydra is a small project\nmade by /r/Z04p intended\nto develop his skills in Pixi JS.", textStyle);
    aboutParagraph.position.set(halfOfRendererWidth, menuTitleY);
    aboutParagraph.anchor.set(0.5, 0.5);
    btnBackLabel = new Text("Back", textStyle);
    btnBackLabel.position.set(halfOfRendererWidth, menuSecondBtnY);
    btnBackLabel.anchor.set(0.5, 0.5);
    title = new Text("Flydra", textStyle);
    title.position.set(ingameTitleX, topLabelY);
    scoreMultiplierLabel = new Text("x" + scoreMultiplier, textStyle);
    scoreMultiplierLabel.position.set(scoreMultiplierX, topLabelY);
    scoreLabel = new Text(score, textStyle);
    scoreLabel.position.set(scoreX ,topLabelY);
    pauseButtonLabel = new Text("Pause", textStyle);
    pauseButtonLabel.position.set(pauseBtnLabelX, pauseBtnLabelY);
    pauseButtonLabel.anchor.set(0.5, 0.5);
    pauseMenuLabel = new Text("Game Paused", textStyle);
    pauseMenuLabel.position.set(halfOfRendererWidth, menuTitleY);
    pauseMenuLabel.anchor.set(0.5, 0.5);
    continueBtnLabel = new Text("Continue", textStyle);
    continueBtnLabel.position.set(halfOfRendererWidth, menuFirstBtnY);
    continueBtnLabel.anchor.set(0.5, 0.5);
    mmLabel_2 = new Text("Menu", textStyle);
    mmLabel_2.position.set(halfOfRendererWidth, menuSecondBtnY);
    mmLabel_2.anchor.set(0.5, 0.5);
    endTitle = new Text("Flydra", textStyle);
    endTitle.position.set(ingameTitleX, topLabelY);
    endScoreMultiplierLabel = new Text("x" + scoreMultiplier, textStyle);
    endScoreMultiplierLabel.position.set(scoreMultiplierX, topLabelY);
    endScoreLabel = new Text(score, textStyle);
    endScoreLabel.position.set(scoreX ,topLabelY);
    gameOverLabel = new Text("You crashed your hydra!", textStyle);
    gameOverLabel.position.set(halfOfRendererWidth, menuFirstBtnY);
    gameOverLabel.anchor.set(0.5, 0.5);
    restartLabel = new Text("Try Again", textStyle);
    restartLabel.position.set(halfOfRendererWidth, menuSecondBtnY);
    restartLabel.anchor.set(0.5, 0.5);
    mmLabel = new Text("Menu", textStyle);
    mmLabel.position.set(halfOfRendererWidth, mmBtnY);
    mmLabel.anchor.set(0.5, 0.5);

    mmBtnPlay = new Sprite(resources.buttonPlay.texture);
    mmBtnAbout = new Sprite(resources.buttonAbout.texture);
    btnBack = new Sprite(resources.buttonMenu.texture);
    pauseButton = new Sprite(resources.buttonPause.texture);
    continueBtn = new Sprite(resources.buttonPlay.texture);
    mmBtn_2 = new Sprite(resources.buttonMenu.texture);
    player = new Sprite(resources.player.texture);
    enemy = new Sprite(resources.enemy.texture);
    restartButton = new Sprite(resources.buttonRestart.texture);
    mmBtn = new Sprite(resources.buttonMenu.texture);

    mmBtnPlay.scale.set(0.8, 0.8);
    mmBtnPlay.position.set(halfOfRendererWidth, menuFirstBtnY);
    mmBtnPlay.anchor.set(0.5, 0.5);
    mmBtnPlay.interactive = true;
    mmBtnPlay.buttonMode = true;
    mmBtnAbout.scale.set(0.8, 0.8);
    mmBtnAbout.position.set(halfOfRendererWidth, menuSecondBtnY);
    mmBtnAbout.anchor.set(0.5, 0.5);
    mmBtnAbout.interactive = true;
    mmBtnAbout.buttonMode = true;
    btnBack.scale.set(0.8, 0.8);
    btnBack.position.set(halfOfRendererWidth, menuSecondBtnY);
    btnBack.anchor.set(0.5, 0.5);
    btnBack.interactive = true;
    btnBack.buttonMode = true;

    pauseButton.scale.set(0.8, 0.8);
    pauseButton.position.set(pauseBtnX, pauseBtnY);
    pauseButton.anchor.set(0.5, 0.5);
    pauseButton.interactive = true;
    pauseButton.buttonMode = true;
    continueBtn.scale.set(0.8, 0.8);
    continueBtn.position.set(halfOfRendererWidth, menuFirstBtnY);
    continueBtn.anchor.set(0.5, 0.5);
    continueBtn.interactive = true;
    continueBtn.buttonMode = true;
    mmBtn_2.scale.set(0.8, 0.8);
    mmBtn_2.position.set(halfOfRendererWidth, menuSecondBtnY);
    mmBtn_2.anchor.set(0.5, 0.5);
    mmBtn_2.interactive = true;
    mmBtn_2.buttonMode = true;

    player.scale.set(0.4, 0.4);
    player.x = halfOfRendererWidth;
    player.y = halfOfRendererWidth;
    player.vx = 0;
    player.vy = 0;
    playerMoveSpeed = 1.053;
    player.anchor.set(0.5, 0.5);
    player.interactive = true;
    player.buttonMode = true;

    // android control support
    // works with mouse too
    // drag the player to move
    player.on('pointerdown', onDragStart)
          .on('pointerup', onDragEnd)
          .on('pointerupoutside', onDragEnd)
          .on('pointermove', onDragMove);

    minSpawnX = Math.round(w / 7.14);
    maxSpawnX = Math.round(w / 1.163);
    spawnY = 0;
    enemySize = 0.1;
    enemy.scale.set(enemySize, enemySize);
    enemy.x = spawnX(minSpawnX, maxSpawnX);
    enemy.y = spawnY;
    enemy.vx = 0;
    enemy.vy = 0;
    enemyMoveSpeed = 3;
    enemy.anchor.set(0.5, 0.4);

    restartButton.scale.set(0.8, 0.8);
    restartButton.position.set(halfOfRendererWidth, menuSecondBtnY);
    restartButton.anchor.set(0.5, 0.5);
    restartButton.interactive = true;
    restartButton.buttonMode = true;
    mmBtn.scale.set(0.8, 0.8);
    mmBtn.position.set(halfOfRendererWidth, mmBtnY);
    mmBtn.anchor.set(0.5, 0.5);
    mmBtn.interactive = true;
    mmBtn.buttonMode = true;

    mmBtnContainer.addChild(mmBtnPlay, mmPlayLabel, mmBtnAbout, mmAboutLabel);
    mainMenuScene.addChild(mmBtnContainer, mmTitle);
    aboutBtnContainer.addChild(btnBack, btnBackLabel);
    aboutScene.addChild(aboutBtnContainer, aboutParagraph);
    pauseMenuBtnContainer.addChild(continueBtn, continueBtnLabel, mmBtn_2, mmLabel_2);
    pauseMenu.addChild(pauseMenuBtnContainer, pauseMenuLabel);
    gameScene.addChild(title, scoreMultiplierLabel, scoreLabel, pauseButtonContainer, player);
    pauseButtonContainer.addChild(pauseButton, pauseButtonLabel);
    restartButtonContainer.addChild(restartButton, restartLabel, mmBtn, mmLabel);
    gameOverScene.addChild(endTitle, endScoreMultiplierLabel, endScoreLabel, gameOverLabel, restartButtonContainer);
    app.stage.addChild(gameOverScene, gameScene, pauseMenu, mainMenuScene, aboutScene);

    //start the game upon pressing the play button
    mmBtnPlay.on('pointerdown', function(e) {

        mainMenuScene.visible = false;
        gameScene.visible = true;

        state = play;
        
    });
    
    //switch to about screen upon pressing the about button
    mmBtnAbout.on('pointerdown', function(e) {

        mainMenuScene.visible = false;
        mmTitle.visible = false;
        mmBtnContainer.visible = false;
        aboutScene.visible = true;
        aboutBtnContainer.visible = true;

    });

    //switch to menu screen upon pressing the back button
    btnBack.on('pointerdown', function(e) {

        aboutScene.visible = false;
        aboutBtnContainer.visible = false;
        mainMenuScene.visible = true;
        mmTitle.visible = true;
        mmBtnContainer.visible = true;

    });

    //pause the game upon pressing the pause button
    //and bring up a pause menu
    pauseButton.on('pointerdown', function(e) {

        state = pause;
        gameScene.visible = false;
        pauseMenu.visible = true;
        pauseMenuBtnContainer.visible = true;

    });

    //continue the game upon pressing the continue button
    continueBtn.on('pointerdown', function(e) {

        state = play;
        pauseMenu.visible = false;
        pauseMenuBtnContainer.visible = false;
        gameScene.visible = true;
        app.start();

    });

    //return to the main menu upon pressing the menu button
    mmBtn_2.on('pointerdown', function(e) {

        score = -100;
        endScore = -100;
        scoreMultiplier = 0.5;
        endScoreMultiplier = 0.5;
        player.x = halfOfRendererWidth;
        player.y = halfOfRendererWidth;
        enemy.y = 500;
        enemyIsAlive = true;
        
        state = menu;
        gameScene.visible = false;
        pauseMenu.visible = false;
        gameOverScene.visible = false;
        restartButtonContainer.visible = false;
        gameScene.visible = false;
        mainMenuScene.visible = true;
        app.start();

    });

    //restart the game upon pressing the restart button
    restartButton.on('pointerdown', function(e) {

        gameOverScene.visible = false;
        restartButtonContainer.visible = false;
        gameScene.visible = true;

        state = play;

    });

    //return to the main menu upon pressing the menu button
    mmBtn.on('pointerdown', function(e) {
        
        gameOverScene.visible = false;
        restartButtonContainer.visible = false;
        gameScene.visible = false;
        mainMenuScene.visible = true;

        state = menu;

    });

    //set the game state
    state = menu;

    //start the game loop
    app.ticker.add(delta => gameLoop(delta));

}

function gameLoop(delta) {

    //update the current game state
    state(delta);

}

function menu() {
    
    //show the menu screen
    mainMenuScene.visible = true;
    gameScene.visible = false;
    gameOverScene.visible = false;
    restartButtonContainer.visible = false;

}

function pause() {

    app.stop();

}

function play(delta) {

    let rotationValue = 0.2;
    let enemyVY = enemy.vy + enemyMoveSpeed;
    let enemyY = enemy.y;
    let despawnPoint = h - 100;

    //use the player's velocity to make it move
    player.x += player.vx;
    player.y += player.vy;

    //move the enemy along the y axis and increase its size
    //to create the 3d effect of a object getting closer
    //despawn when enemy is too close
    if (enemyY >= despawnPoint && enemyIsAlive === true) {

        scoreMultiplier += 0.5;
        score += 100 * scoreMultiplier;
        enemyIsAlive = false;
        enemySize = 0.1;
        enemy.scale.set(enemySize, enemySize);
        enemy.x = spawnX(minSpawnX, maxSpawnX);
        enemy.y = spawnY;
        enemy.anchor.set(0.5, 0.4);
        gameScene.removeChild(enemy);

    } else if (enemyY < despawnPoint && enemyIsAlive === true) {
        
        enemy.y += enemyVY;
        enemy.scale.set(enemySize += 0.003, enemySize += 0.003);

    } else {

        enemyIsAlive = true;
        gameScene.addChildAt(enemy, 0);

    }

    scoreMultiplierLabel.text = "x" + scoreMultiplier;
    scoreLabel.text = score;
    endScoreMultiplierLabel.text = "x" + scoreMultiplier;
    endScoreLabel.text = score;
    
    //check for collision between player and enemy
    if (hitTestRectangle(player, enemy)) {

        //if there's collision do these
        player.rotation += rotationValue;
        state = end;

    } else {

        //if there's no collision do these
        player.rotation = rotationValue * 0;

    }

}

function end() {

    //launch the gameover scene
    score = -100;
    endScore = -100;
    scoreMultiplier = 0.5;
    endScoreMultiplier = 0.5;
    player.x = halfOfRendererWidth;
    player.y = halfOfRendererWidth;
    enemy.y = 500;
    enemyIsAlive = true;
    gameScene.visible = false;
    gameOverScene.visible = true;
    restartButtonContainer.visible = true;

}

function spawnX(min, max) {

    return Math.floor(Math.random() * (max - min)) + min;

}

// android control support
// works with mouse too
// drag to move player
function onDragStart(event) {

    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    // this.alpha = 0.5;
    this.dragging = true;

}

function onDragEnd() {

    // this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;

}

function onDragMove() {

    if (this.dragging) {

        var newPosition = this.data.getLocalPosition(this.parent);
        var delta = 1;
        var dt = playerMoveSpeed;
        var dt = 1.0 - Math.exp(1.0 - dt, delta);

        if (Math.abs(this.x - newPosition.x) + Math.abs(this.y - newPosition.y) < 1) {
            this.x = newPosition.x;
            this.y = newPosition.y;
        } else {
            this.x = this.x + (newPosition.x - this.x) * dt;
            this.y = this.y + (newPosition.y - this.y) * dt;
        }

    }

}


function hitTestRectangle(r1, r2) {

    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
  
    //hit will determine whether there's a collision
    hit = false;
  
    //Find the center points of each sprite
    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;
  
    //Find the half-widths and half-heights of each sprite
    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 6;
    r2.halfHeight = r2.height / 6;
  
    //Calculate the distance vector between the sprites
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;
  
    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;
  
    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
  
      //A collision might be occurring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {
  
        //There's definitely a collision happening
        hit = true;
      } else {
  
        //There's no collision on the y axis
        hit = false;
      }
    } else {
  
      //There's no collision on the x axis
      hit = false;
    }
  
    //`hit` will be either `true` or `false`
    return hit;
}