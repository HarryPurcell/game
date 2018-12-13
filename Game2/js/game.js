// create a new scene
let gameScene = new Phaser.Scene('Game');


gameScene.preload = function () {
// loading Images
    this.load.image('background', 'assets/bg.png');
    this.load.image('sandfloor', 'assets/sandfloor.png');
    this.load.image('cactus', 'assets/cactus.png');
    this.load.image('llama', 'assets/llamastill.png');
// loading Audio
    this.load.audio('loop', 'assets/music/loop.wav');
// loading buttons
    this.load.spritesheet('volume', 'assets/volume.png', {
        frameWidth: 120,
        frameHeight: 120
    })
};

gameScene.create = function () {  
    
//Creating background
    this.gameSpeed = 6;
    
    let bg = this.add.sprite(0, 0, 'background');
    bg.setOrigin(0.0);
    
//Volume Button
    let volumeBtn = this.add.sprite(600,40,'volume').setScale(.5).setInteractive();
    
    this.sound.pauseOnBlur = false;
    this.music = this.sound.add('loop',{loop:true});
    this.music.play()

//score
    this.score = 0;
    this.scoreTxt = gameScene.add.text(310, 20, this.score, {
        fontFamily: 'Comic Sans MS',
    fontSize: 64,
    color: '#000',
    align: 'center'
    });
    
//cactus configuration details
    this.cactusMinX = 0;
    this.cactusOrig = 1200;
    
//adding the cacti
    this.cactus = this.add.group({
        key: 'cactus',
        repeat: 4,
        setXY: {
            x: 800,
            y: 235,
            stepX: 200,
            stepY: -60
        }
    });
   
    
    
    
//The scrolling roof background
    gameScene.roof = gameScene.add.tileSprite(320, 320, 636, 110, 'sandfloor');
    this.physics.add.existing(gameScene.roof);
    gameScene.roof.visible = true;
    
//console.log(gameScene.roof);
    gameScene.roof.body.setCollideWorldBounds(true);
    
//Adding physics to the cactus
    this.physics.add.collider(this.cactus, gameScene.roof);

//Adding physics to llama
    this.llama = this.physics.add.sprite(70,50,'llama');
    this.llama.setCollideWorldBounds(true);
    this.physics.add.collider(this.llama, gameScene.roof);
    
    this.pointer = this.input.activePointer;
};


gameScene.update = function () {
//move sandfloor along the screen
    gameScene.roof.tilePositionX += this.gameSpeed;


//Making llama jump with mouse click
    if (this.pointer.isDown == true){
        if(this.llama.body.touching.down){
             console.log("jumping!");
            this.llama.setVelocityY(-300);
        } else{
            this.llama.setVelocityY(-200);
        }  
    } 
      
    
    let cactus = this.cactus.getChildren();
    let numCactus = cactus.length;

    for (let i = 0; i < numCactus; i++) {
// move cactus at rate of gamespeed
        cactus[i].x -= this.gameSpeed;
      
// once passed the screen. reposition right of the screen with a random Y position
        if (cactus[i].x <= this.cactusMinX) {
            cactus[i].x = this.cactusOrig;
            cactus[i].y = Phaser.Math.Between(0, 250);
            this.score++;
            this.scoreTxt.setText(this.score);
            console.log(this.score);
        }

// Gameover on collision
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.llama.getBounds(), cactus[i].getBounds())) {
            this.gameOver();
            break;
        }
    }

};

gameScene.gameOver = function() {
//Camera Shakes, music detunes then stops, game restarts.
    
    this.music.setDetune(-800);
    this.cameras.main.shake(1000);
    this.time.delayedCall(1000, function() {
        this.scene.restart(),
        this.music.stop();
    }, [], this);
}

// game configuration
let config = {
    type: Phaser.AUTO, // Phaser will use WebGL if available, if not it will use Canvas
    width: 640,
    height: 360,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 600
            },
            debug: false
        }
    },
    scene: gameScene,

};
// create a new game, pass the configuration
let game = new Phaser.Game(config);
