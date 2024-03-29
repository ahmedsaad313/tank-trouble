var mwh = 1824;
var mww = 2736;
var bulletSize;
var bulletSpeed;  
var tankSize;
var player1;
var player2;
var bullets = [];
var myBullets = 0;
var walls= [];
var tankSpeedf;
var tankSpeedb;
var wallThickness;
let h, w;

class tank {
  constructor(x, y, degree, life) {
    this.x = x;
    this.y = y;
    this.degree = degree;
    this.life = 7;
    this.determineDegree = function(){
      if (keyIsDown(LEFT_ARROW)){
        this.degree -= .08;
      }
      if (keyIsDown(RIGHT_ARROW)){
        this.degree += .08;
      }
      sendUpdatedPlayerInfo(this.x, this.y, this.degree);
    }
    this.moveTanks = function(){
      if (keyIsDown(UP_ARROW)){
        this.x += cos(this.degree) * tankSpeedf;
        this.y += sin(this.degree) * tankSpeedf;
      }
    
      if (keyIsDown(DOWN_ARROW)){
        this.x -= cos(this.degree) * tankSpeedb;
        this.y -= sin(this.degree) * tankSpeedb;
      }
      sendUpdatedPlayerInfo(this.x, this.y, this.degree);
    }
    this.checkBoundsTank = function(){
      for (let i = 0; i < walls.length; i++){
        if (this.x + tankSize/2 >= walls[i].x &&
          this.x - tankSize/2 <= walls[i].x + walls[i].w &&
          this.y + tankSize/2 >= walls[i].y &&
          this.y - tankSize/2 <= walls[i].y + walls[i].h){
            if (this.x > walls[i].x && this.x <= walls[i].x + walls[i].w && this.y < walls[i].y){
              this.y = walls[i].y - tankSize/2;
            }
            if (this.x > walls[i].x && this.x <= walls[i].x + walls[i].w && this.y > walls[i].y + walls[i].h){
              this.y = walls[i].y + walls[i].h + tankSize/2;
            }
            if (this.y > walls[i].y && this.y <= walls[i].y + walls[i].h && this.x < walls[i].x){
              this.x = walls[i].x - tankSize/2;
            }
            if (this.y > walls[i].y && this.y <= walls[i].y + walls[i].h && this.x > walls[i].x + walls[i].w){
              this.x = walls[i].x + walls[i].w + tankSize/2;
            }
            if (this.x < walls[i].x && this.y < walls[i].y){
              //round test top left
              if (dist(this.x, this.y, walls[i].x, walls[i].y) < tankSize/2){
                let opp = walls[i].x - this.x;
                let hyp = dist(this.x, this.y, walls[i].x, walls[i].y);
                let d = (3.14159/2) + asin(opp/hyp);
                this.x = walls[i].x - (cos(d) * tankSize/2 * -1);
                this.y = walls[i].y - (sin(d) * tankSize/2);
              }
            }
            if (this.x > walls[i].x + walls[i].w && this.y < walls[i].y){
              //round test top right
              if (dist(this.x, this.y, walls[i].x + walls[i].w, walls[i].y) < tankSize/2){
                let opp = walls[i].y - this.y;
                let hyp = dist(this.x, this.y, walls[i].x + walls[i].w, walls[i].y);
                let d = (3.14159/2) + asin(opp/hyp);
                this.x = walls[i].x + walls[i].w + (sin(d) * tankSize/2);
                this.y = walls[i].y - (cos(d) * tankSize/2 * -1);
              }
            }
            if (this.x < walls[i].x && this.y > walls[i].y + walls[i].h){
              //round test bottom left
              if (dist(this.x, this.y, walls[i].x, walls[i].y + walls[i].h) < tankSize/2){
                let opp = this.y - (walls[i].y + walls[i].h);
                let hyp = dist(this.x, this.y, walls[i].x, walls[i].y + walls[i].h);
                let d = (3.14159/2) + asin(opp/hyp);
                this.x = walls[i].x - (sin(d) * tankSize/2);
                this.y = walls[i].y + walls[i].h + (cos(d) * tankSize/2 *-1);
              }
            }
            if (this.x > walls[i].x + walls[i].w && this.y > walls[i].y + walls[i].h){
              //round test bottom right
              if (dist(this.x, this.y, walls[i].x + walls[i].w, walls[i].y + walls[i].h) < tankSize/2){
                let opp = this.y - (walls[i].y + walls[i].h);
                let hyp= dist(this.x, this.y, walls[i].x + walls[i].w, walls[i].y + walls[i].h);
                let d = (3.14159/2) + asin(opp/hyp);
                this.x = walls[i].x + walls[i].w + (sin(d) * tankSize/2);
                this.y = walls[i].y + walls[i].h + (cos(d) * tankSize/2 * -1);
              }
            }
        }
      }
      sendUpdatedPlayerInfo(this.x, this.y, this.degree);
    }
  }
}

function drawHearts(isMyTank, tank){
  if (isMyTank){
    for (let i = 1; i <= tank.life; i++){
      fill("red");
      heart(w - 65/mww * w *i, h/40, h/40);
    }
  }
  else{
    for (let i = 1; i <= tank.life; i++){
      fill("green");
      heart(65/mww * w *i, h/40, h/40);
    }
  }
}

class wall {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
}

class bullet {
  constructor(x, y, life, xInc, yInc ,isMyBullet, timestamp) {
    this.x = x;
    this.y = y;
    this.life = life;
    this.xInc = xInc;
    this.yInc = yInc;
    this.isMyBullet = isMyBullet;
    this.timestamp = timestamp;
    this.checkBoundsBullet = function(){
      for (let i = 0; i < walls.length; i++){
        if (this.x + bulletSize/2 >= walls[i].x &&
        this.x - bulletSize/2 <= walls[i].x + walls[i].w &&
        this.y + bulletSize/2 >= walls[i].y &&
        this.y - bulletSize/2 <= walls[i].y + walls[i].h){
          if (this.x > walls[i].x && this.x <= walls[i].x + walls[i].w && this.y < walls[i].y){
            this.yInc *= -1;
            if(this.check()){
              this.xInc *=- 1;
            }
            break;
          }
          if (this.x > walls[i].x && this.x <= walls[i].x + walls[i].w && this.y > walls[i].y + walls[i].h){
            this.yInc *= -1;
            if(this.check()){
              this.xInc *=- 1;
            }
            break;
          }
          if (this.y > walls[i].y && this.y <= walls[i].y + walls[i].h && this.x < walls[i].x){
            this.xInc *= -1;
            if(this.check()){
              this.yInc *=- 1;
            }
            break;
          }
          if (this.y > walls[i].y && this.y <= walls[i].y + walls[i].h && this.x > walls[i].x + walls[i].w){
            this.xInc *= -1;
            if(this.check()){
              this.yInc *=- 1;
            }
            break;
          }
          if (this.x < walls[i].x && this.y < walls[i].y){
            //round test top left
            if (dist(this.x, this.y, walls[i].x, walls[i].y) < bulletSize/2 * 1.5){
              this.xInc *= -1;
              this.x -= bulletSize/2;
              break;
            }
          }
          if (this.x > walls[i].x + walls[i].w && this.y < walls[i].y){
            //round test top right
            if (dist(this.x, this.y, walls[i].x + walls[i].w, walls[i].y) < bulletSize/2 * 1.5){
              this.xInc *= -1;
              this.x += bulletSize/2;
              break;
            }
          }
          if (this.x < walls[i].x && this.y > walls[i].y + walls[i].h){
            //round test bottom left
            if (dist(this.x, this.y, walls[i].x, walls[i].y + walls[i].h) < bulletSize/2 * 1.5){
              this.xInc *= -1;
              this.x -= bulletSize/2;
              break;
            }
          }
          if (this.x > walls[i].x + walls[i].w && this.y > walls[i].y + walls[i].h){
            //round test bottom right
            if (dist(this.x, this.y, walls[i].x + walls[i].w, walls[i].y + walls[i].h) < bulletSize/2 * 1.5){
              this.yInc *= -1;
              this.y += bulletSize/2;
              break;
            }
          }
        }
      }
    }
    this.checkBulletTankCollision = function(bullPos){
      if (dist(this.x, this.y, player1.x, player1.y) <= (bulletSize + tankSize)/2){
        if (bullets[bullPos].isMyBullet){
          myBullets--;
        }
        bullets.splice(bullPos,1);
        deleteBullet(bullPos);
        bullPos--;
        player1.life--;
        updateLife(player1.life);
        if (player1.life == 0){
          alert("You lost, you loser, HAHAHAHAHAHA!")
        }
      }
    }
    this.check = function(){
      for (let i = 0; i < walls.length; i++){
        if (this.x + this.xInc + bulletSize/2 >= walls[i].x &&
        this.x + this.xInc - bulletSize/2 <= walls[i].x + walls[i].w &&
        this.y + this.yInc + bulletSize/2 >= walls[i].y &&
        this.y +this.yInc - bulletSize/2 <= walls[i].y + walls[i].h){
          return true;
        }
      }
      return false;
    }
  }
}

function setup(){
  generateHW();
  tankSpeedf = 14/mwh * h;
  tankSpeedb = 9/mwh * h;
  bulletSize = 30/mwh * h;
  bulletSpeed = 15/mwh * h;
  tankSize = 90/mww * w;
  wallThickness = 33/mww * w;
  makeWalls();
  makePlayers();
}

function draw() {
  createCanvas(w, h);
  background('yellow');
  drawWalls();
  drawBullets();
  drawTanks();
}

function generateHW(){
 h = 0;
 w = 0;
  while (h <= windowHeight && w <= windowWidth){
    h += .802;
    w += 1.368
  }
}

function makePlayers(){
  player1 = new tank(Math.floor(Math.random()*w),
   (Math.floor(Math.random()*h)), (Math.floor(Math.random()*360)));
  player2 = new tank(Math.floor(Math.random()*w),
   (Math.floor(Math.random()*h)), (Math.floor(Math.random()*360)));
   checkPlayersNotInWall();
}

function checkPlayersNotInWall(){
  for (let i = 0; i < walls.length; i++){
    if (player1.x >= walls[i].x &&
      player1.x <= walls[i].x + walls[i].w &&
      player1.y >= walls[i].y &&
      player1.y <= walls[i].y + walls[i].h){
        makePlayers();
    }
  }
}
function makeWalls(){
  walls.push(new wall(0, 0, w, wallThickness));
  walls.push(new wall(w-wallThickness, 0, wallThickness, h));
  walls.push(new wall(0, 0, wallThickness, h));
  walls.push(new wall(0,h-wallThickness, w, wallThickness));
  walls.push(new wall(w/3, h/3, wallThickness, w/4));
  walls.push(new wall(w * (3/7), h/4, wallThickness, h/3));
  walls.push(new wall(w * (6/7), h * (2/4), wallThickness, h * (3/8)));
  walls.push(new wall(w * (1/7), h * (1/4), wallThickness, h/2));
  walls.push(new wall(w * (4/10), h * (1/8), w * (5/10), wallThickness));
  walls.push(new wall(w * (3/7), h * (4/7), w * (3/7), wallThickness));
  walls.push(new wall(w * (1/7), h * (3/4), w * (1/2), wallThickness));
  walls.push(new wall(w * (5/7), h * (3/4), w * (1/7), wallThickness));
  walls.push(new wall(w/2, h * (2/5), w/3, wallThickness));
  walls.push(new wall(w/13, h * (6/7), w/4, wallThickness));
  walls.push(new wall(w/13, h * (4/7), wallThickness, h * (2/7)));
  walls.push(new wall(w * (1/4), h * (1/7), wallThickness, h * (3/7)));
  walls.push(new wall(w * (2/3), h/4, w/3, wallThickness));
  walls.push(new wall(w * (1/10), h/8, w * (2/9), wallThickness));
  walls.push(new wall(w * (3/4), 0, wallThickness, h/15));
  walls.push(new wall(w * (9/17), h * (13/15), wallThickness, h * (2/15)));
  walls.push(new wall(0, h/3, w/15, wallThickness));
}

function drawWalls(){
  strokeWeight(0);
  fill(color(80));
  for (let i = 0; i < walls.length; i++){
    rect(walls[i].x, walls[i].y, walls[i].w, walls[i].h);
  }
}

function drawTanks(){
  player1.determineDegree();
  strokeWeight(0);
  fill('black');
  drawHearts(true, player1);
  drawHearts(false, player2);
  player1.moveTanks();
  player1.checkBoundsTank();
  fill('black');
  //draw tank1 body
  ellipse(player1.x, player1.y, tankSize);
  //draw tank1 gun
  stroke('red');
  strokeWeight(20/mwh * h);
  line(player1.x, player1.y, player1.x + cos(player1.degree) * tankSize * (3/4),
  player1.y + sin(player1.degree) * tankSize * (3/4)) ;
  //draw tank2 body
  fill('maroon');
  stroke('black')
  strokeWeight(0)
  ellipse(player2.x, player2.y, tankSize);

  //draw tank2 gun
  fill('gray');
  strokeWeight(20/mwh * h);
  line(player2.x, player2.y, player2.x + cos(player2.degree) * tankSize * (3/4),
  player2.y + sin(player2.degree) * tankSize * (3/4)) ;
}

function updateOpponentPlayer(player2x, player2y, player2degree){
  player2.x = player2x * w;
  player2.y = player2y * h;
  player2.degree = player2degree;
}

function addOpponentBullet(x, y, life, xInc, yInc){
  bullets.push(new bullet(x * w, y * h, life, xInc * w, yInc * h, false, new Date()));
}

function deleteBulletHitWithOpponent(j){
  bullets.splice(j,1);
}

function updateOpponetHearts(hearts){
  player2.life = hearts;
  if (player2.life == 0){
    alert("You won, thats crazy, you're HIM!")
  }
}



//construction of heart not original
function heart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}

 
function keyPressed(){
  if (keyCode == 32 && myBullets < 10){
    
    //making bullet
    let bulletDate = new Date();
    let currBullet = new bullet(player1.x + cos(player1.degree) * tankSize * (3/4),
    player1.y + sin(player1.degree) * tankSize * (3/4),
    1000, 
    cos(player1.degree) * bulletSpeed,
    sin(player1.degree) * bulletSpeed,
    true,
    bulletDate);

    //pushing the bullet to bullets array by timestamp
    if (bullets.length == 0){
      bullets.push(currBullet);
    }
    else{
      for (let i = 0; i < bullets.length; i++){
        if (currBullet.timestamp < bullets[i].timestamp){
          bullets.splice(i, 0, currBullet);
        }
        else if (currBullet.timestamp > bullets[i].timestamp){
          if (i == bullets.length - 1){
            bullets.push(currBullet);
          }
        }
      }
    }

    myBullets++;
    console.log(bullets);

    for(let i = 0; i < walls.length; i++){ 
      if (bullets[bullets.length-1].x + 10/mww * w >= walls[i].x &&
        bullets[bullets.length-1].x - 10/mww * w <= walls[i].x + walls[i].w &&
        bullets[bullets.length-1].y + 10/mwh * h >= walls[i].y &&
        bullets[bullets.length-1].y - 10/mwh * h <= walls[i].y + walls[i].h){
        bullets.pop();
        myBullets--;
        return;
      }
    }
    
    sendNewBulletToOpponent(player1.x + cos(player1.degree) * tankSize * (3/4),
    player1.y + sin(player1.degree) * tankSize * (3/4),
    1000, 
    cos(player1.degree) * (bulletSpeed / w),
    sin(player1.degree) * (bulletSpeed / h));
  }
}

function drawBullets(){
  strokeWeight(0/mwh * h)
  fill('blue');
  for (let j = 0; j < bullets.length; j++){
    bullets[j].checkBoundsBullet();
    bullets[j].checkBulletTankCollision(j);
  }
  for (let i = 0; i < bullets.length; i++){
    bullets[i].x += bullets[i].xInc;
    bullets[i].y += bullets[i].yInc;
  }
  for (let i = 0; i < bullets.length; i++){
    bullets[i].life--;
      if (bullets[i].life <= 0){
        if (bullets[i].isMyBullet){
          myBullets--;
        }
        bullets.splice(i,1);
        break;
    }
  }
  for (let i = 0; i < bullets.length; i++){
  ellipse(bullets[i].x, bullets[i].y, bulletSize);
  }
}


