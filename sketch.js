let leftBuffer;
let centerBuffer;
let rightBuffer;

let branches1 = [];
let branches2 = [];
let branches3 = [];

function setup() {
    // 800 x 400 (double width to make room for each "sub-canvas")
    createCanvas(1350, 600);
    background(0);
    // Create both of your off-screen graphics buffers
    leftBuffer = createGraphics(450, 600);
    centerBuffer = createGraphics(450, 600);
    rightBuffer = createGraphics(450, 600);
  
    branches1.push(new Branch1(
      createVector(centerBuffer.width/2, centerBuffer.height), 50));
    branches2.push(new Branch2(
        createVector(leftBuffer.width/2, leftBuffer.height), 50));
    branches3.push(new Branch3(
        createVector(rightBuffer.width/2, rightBuffer.height), 50));
}

function draw() {
    // Draw on your buffers however you like
    drawLeftBuffer();
    drawCenterBuffer();
    drawRightBuffer();
    // Paint the off-screen buffers onto the main canvas
    image(leftBuffer, 0, 0);
    image(centerBuffer, 450, 0);
    image(rightBuffer, 900, 0);
}

function drawLeftBuffer() {
    leftBuffer.background(255);
    for(let i = 0; i < branches2.length; i++){
      branches2[i].grow();
      branches2[i].show();
    }
}

function drawCenterBuffer() {
    centerBuffer.background(255);
    for(let i = 0; i < branches1.length; i++){
      branches1[i].grow();
      branches1[i].show();
    }
}

function drawRightBuffer() {
    rightBuffer.background(255);
    for(let i = 0; i < branches3.length; i++){
      branches3[i].grow();
      branches3[i].show();
    }
}

class Branch1{
  constructor(startPos, startSize){
    this.startPos = startPos;
    this.positions = [];
    
    this.xMove = 6;
    this.yMove = 4;
    this.yDir = 0.8;
    
    this.sizes = [];
    this.size = 1;
    this.startSize = startSize;
    this.ySizes = [];
    
    this.lifespan = 400;
    this.age = 0;
    
    this.xoff = random(500);
    this.yoff = random(500);
    
    this.noiseV = 0.01;
    
    this.positions.push(startPos);
    this.sizes.push(startSize);
    this.ySizes.push(random(1, 5));
    
    this.isDone = false;
  }
  
  grow(){
    if (this.age < this.lifespan){ 
      this.age ++;
      
      this.xoff ++;
      this.yoff ++;
      
      let newPos = this.positions[this.positions.length-1].copy();
      // let moveAmount = createVector(
      //   (noise((frameCount+this.index) * 0.01) - 0.5) * 7, 
      //   (noise(frameCount * 0.02) - 0.8) * 5);
      let moveAmount = createVector(
        (map(noise(this.xoff * this.noiseV), 0, 1, -0.5, 0.51) * this.xMove), 
        (noise(this.yoff * this.noiseV+0.01) - this.yDir) * this.yMove);
      newPos.add(moveAmount);
      
      this.positions.push(newPos);
      
      if (this.size < this.startSize) {
          this.size += random(-0.2, 0.4);
        }
      
      this.sizes.push(this.size);
      this.ySizes.push(random(1, 5));
      
      if(random(1) < 0.011 && branches1.length < 50) {
        this.ramification(newPos, this.size, false);
      } 
      
    } else {
      this.isDone = true;
    }
  }
  
  ramification(startPos, startSize, isInfected){
    let a = new Branch1(startPos, startSize);
    a.lifespan *= random(0.1, 0.5);
    
    branches1.push(a);
  }
  
  show(){
    for(let i = 0; i < this.positions.length; i++){
      centerBuffer.fill(255);
      centerBuffer.ellipse(this.positions[i].x, this.positions[i].y, this.sizes[this.sizes.length-i], this.ySizes[i]);
    }
  }
}

//===================================================================
class Branch2{
  constructor(startPos, startSize){
    this.startPos = startPos;
    this.positions = [];
    
    this.xMove = 6;
    this.yMove = 4;
    this.yDir = 0.8;
    
    this.color = 150;
    this.alpha = 255;
    
    this.sizes = [];
    this.size = 1;
    this.startSize = startSize;
    this.ySizes = [];
    
    this.lifespan = 400;
    this.age = 0;
    
    this.xoff = random(500);
    this.yoff = random(500);
    
    this.noiseV = 0.01;
    
    this.positions.push(startPos);
    this.sizes.push(startSize);
    this.ySizes.push(random(1, 5));

    this.isInfected = false;
    this.isDone = false;
    
    this.parasite = new Parasite2();
  }
  
  grow(){
    if (this.age < this.lifespan){ 
      this.age ++;
      
      this.xoff ++;
      this.yoff ++;
      
      let newPos = this.positions[this.positions.length-1].copy();
      // let moveAmount = createVector(
      //   (noise((frameCount+this.index) * 0.01) - 0.5) * 7, 
      //   (noise(frameCount * 0.02) - 0.8) * 5);
      let moveAmount = createVector(
        (map(noise(this.xoff * this.noiseV), 0, 1, -0.5, 0.5) * this.xMove), 
        (noise(this.yoff * this.noiseV+0.01) - this.yDir) * this.yMove);
      newPos.add(moveAmount);
      
      this.positions.push(newPos);
      
      if (this.size < this.startSize) {
          this.size += random(-0.2, 0.4);
      }
      
      this.sizes.push(this.size);
      this.ySizes.push(random(1, 5));
      
      if(random(1) < 0.011 && branches2.length < 50) {
        if (this.isInfected == false) this.ramification(newPos, this.size, false);
        else this.ramification(newPos, this.size, true);
      } 
      
    } else {
      this.isDone = true;
    }
  }
  
  ramification(startPos, startSize, isInfected){
    let a = new Branch2(startPos, startSize);
    
    if (random(1) < 0.3 || isInfected == true) a.isInfected = true;
    if (a.isInfected == true){
      a.lifespan *= random(0.1, 0.8);
      
      a.xMove = a.parasite.posX;
      a.yDir = a.parasite.posY;
      a.noiseV = a.parasite.noise;
      a.color = a.parasite.color;
      a.alpha = a.parasite.alpha;
      
    }
    else {
      a.lifespan *= random(0.1, 0.5);
    }
    
    branches2.push(a);
  }
  
  show(){
    for(let i = 0; i < this.positions.length; i++){
      leftBuffer.fill(this.color);
      leftBuffer.stroke(0, this.alpha);
      leftBuffer.ellipse(this.positions[i].x, this.positions[i].y, this.sizes[this.sizes.length-i], this.ySizes[i]);
    }
  }
}

class Parasite2{
  constructor(){
    this.posX = random(5, 12);
    this.posY = random(0.4, 0.6);
    this.noise = 2;
    this.color = 255;
    this.alpha = 100;
    
    this.size = random(3, 6);
    
    if (random(1) < 0.5) this.isActive = true;
    else this.isActive = false;
  }
}

//===================================================================
class Branch3{
  constructor(startPos, startSize){
    this.startPos = startPos;
    this.positions = [];
    
    this.xMove = 6;
    this.yMove = 4;
    this.yDir = 0.8;
    
    this.color = 150;
    this.alpha = 255;
    
    this.sizes = [];
    this.size = 1;
    this.startSize = startSize;
    this.ySizes = [];
    
    this.lifespan = 400;
    this.age = 0;
    
    this.xoff = random(500);
    this.yoff = random(500);
    
    this.noiseV = 0.01;
    
    this.positions.push(startPos);
    this.sizes.push(startSize);
    this.ySizes.push(random(1, 5));

    this.isDone = false;
    
    this.parasite = new Parasite3();
  }
  
  grow(){
    if (this.age < this.lifespan){ 
      this.age ++;
      
      this.xoff ++;
      this.yoff ++;
      
      let newPos = this.positions[this.positions.length-1].copy();
      // let moveAmount = createVector(
      //   (noise((frameCount+this.index) * 0.01) - 0.5) * 7, 
      //   (noise(frameCount * 0.02) - 0.8) * 5);
      let moveAmount = createVector(
        (map(noise(this.xoff * this.noiseV), 0, 1, -0.5, 0.5) * this.xMove), 
        (noise(this.yoff * this.noiseV+0.01) - this.yDir) * this.yMove);
      newPos.add(moveAmount);
      
      this.positions.push(newPos);
      
      if (this.size < this.startSize) {
          this.size += random(-0.2, 0.4);
      }
      
      this.sizes.push(this.size);
      this.ySizes.push(random(1, 5));
      
      if(random(1) < 0.01 && branches3.length < 50) {
        this.ramification(newPos, this.size, false);
      } 
      
    } else {
      this.isDone = true;
    }
    
    if (this.isDone == true) {
      if (this.parasite.index == null) {
        this.parasite.index = floor(random(this.parasite.range, this.sizes.length - this.parasite.range));
        this.parasite.maxSize = this.parasite.size * this.sizes[this.parasite.index];
      }
      else {
        this.parasite.makeLump(this.sizes);
      }
    }
  }
  
  ramification(startPos, startSize, isInfected){
    let a = new Branch3(startPos, startSize);
    a.lifespan *= random(0.1, 0.5);
    
    branches3.push(a);
  }
  
  show(){
    for(let i = 0; i < this.positions.length; i++){
      rightBuffer.fill(this.color);
      rightBuffer.stroke(0, this.alpha);
      rightBuffer.ellipse(this.positions[i].x, this.positions[i].y, this.sizes[this.sizes.length-i], this.ySizes[i]);
    }
  }
}

class Parasite3{
  constructor(){
    this.size = random(10, 100);
    this.maxSize = null;
    this.index = null;
    this.range = floor(random(10, 20));
        
    if (random(1) < 0.7) this.isActive = true;
    else this.isActive = false;
  }
  
  makeLump(sizes){
    const minRange = this.index - this.range;
    const maxRange = this.index + this.range;
        
    let a = 0;
    const inc = PI/(this.range*2);
          
    if (this.index != null && this.isActive == true && sizes[this.index] < this.maxSize){
      for (let i = minRange; i < maxRange; i++){
        sizes[i] += sin(a) * 0.1;
        a += inc;
      }
    }
  }
}