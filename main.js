window.onload = function() {
  //                                                             ----- Variables -----
  let canvasWidth = 900;
  let canvasHeight = 600;
  let blockSize = 30;
  let ctx;
  let delay = 85;
  let snakee;
  let applee;
  let widthInBlocks = canvasWidth / blockSize;
  let heightInBlocks = canvasHeight / blockSize;
  let score;
  
  init();
  
  //                                                              -----functInit-----
  function init() {
    let canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "20px solid grey";
    canvas.style.margin = "50px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#ddd";
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    snakee = new Snake([[6, 4], [5, 4], [4, 4]], "right");
    applee = new Apple([10, 10]);
    score = 0;
    refreshCanvas();
  }
  
  //                                                             ---- RefrechCanvas -----
  function refreshCanvas() {
    snakee.advance();
    if (snakee.checkCollision()) {
      gameOver();
    } else {
      if (snakee.isEatingApple(applee)) {
        score++;
        snakee.eatApple = true;
        do {
          applee.setNewPosition();
        } while (applee.isOnSnake(snakee));
      }
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      snakee.draw();
      applee.draw();
      drawScore();
      setTimeout(refreshCanvas, delay);
    }
  }
  
  //                                                              ----- GameOver -----
  function gameOver() {
    ctx.save();
    ctx.font = "18px Arial";
    ctx.fillText("Game Over", 5, 18);
    ctx.fillText("Appuyez sur la touche Espace pour rejouer", 5, 37);
    ctx.restore();
  }
  
  //                                                               ----- restart -----
  function restart() {
    snakee = new Snake([[6, 4], [5, 4], [4, 4]], "right");
    applee = new Apple([10, 10]);
    score = 0;
    refreshCanvas();
  }
  
  //                                                              ----- DrawScore ----- 
  function drawScore() {
    ctx.save();
    ctx.font = "bold 24px Arial";
    ctx.fillText(score.toString(), 5, canvasHeight - 5);
    ctx.restore();
  }
  
  //                                                               -----DrawBlock-----
  function drawBlock(ctx, position) {
    let x = position[0] * blockSize;
    let y = position[1] * blockSize;
    ctx.fillRect(x, y, blockSize, blockSize);
  }
  

  //                                                             ----- Funct Snake -----
  function Snake(body, direction) {
    this.body = body;
    this.direction = direction;
    this.eatApple = false;
    this.draw = function() {
      ctx.save();
      for (let i = 0; i < this.body.length; i++) {
        let x = this.body[i][0] * blockSize + blockSize / 2;
        let y = this.body[i][1] * blockSize + blockSize / 2;
  
        let gradient = ctx.createLinearGradient(x - blockSize / 2, y - blockSize / 2, x + blockSize / 2, y + blockSize / 2);
        gradient.addColorStop(0, "#00FF20"); 
        gradient.addColorStop(1, "#002705"); 
        ctx.fillStyle = gradient;
  
        //  Cercle pour chaque bloc du serpent
        ctx.beginPath();
        ctx.arc(x, y, blockSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };
  
    
    //                                                            ----- moove -----
    this.advance = function() {
      // @ts-ignore
      let nextPosition = this.body[0].slice();
      // @ts-ignore
      switch (this.direction) {
        case "left":
          nextPosition[0] -= 1;
          break;
        case "right":
          nextPosition[0] += 1;
          break;
        case "down":
          nextPosition[1] += 1;
          break;
        case "up":
          nextPosition[1] -= 1;
          break;
        default:
          throw ("Invalid Direction");
      }
      // @ts-ignore
      this.body.unshift(nextPosition);
      if (!this.eatApple)
        // @ts-ignore
        this.body.pop();
      else
        this.eatApple = false;
    };
  
    
    //                                                             ----- Allow Direction -----
    this.setDirection = function(newDirection) {
      let allowedDirections;
      switch (this.direction) {
        // @ts-ignore
        case "left":
        // @ts-ignore
        case "right":
          allowedDirections = ["up", "down"];
          break;
        // @ts-ignore
        case "down":
        // @ts-ignore
        case "up":
          allowedDirections = ["left", "right"];
          break;
        default:
          throw ("Invalid Direction");
      }
      if (allowedDirections.indexOf(newDirection) > -1) {
        this.direction = newDirection;
      }
    };
  
    //                                                                  -----Collision----- 
    this.checkCollision = function () {
      let wallCollision = false;
      let snakeCollision = false;
      let head = this.body[0];
      let snakeX = head[0];
      let snakeY = head[1];
      let minX = 0;
      let minY = 0;
      let maxX = widthInBlocks -1;
      let maxY = heightInBlocks -1;
      let isNotBetweenHorizontalwalls = snakeX < minX || snakeX > maxX;
      let isNotBetweenverticalwalls = snakeY < minY || snakeY > maxY;
  
      if (isNotBetweenHorizontalwalls || isNotBetweenverticalwalls){
        wallCollision = true;
      }
  
      for (let i = 1; i < this.body.length; i++) {
        if (this.body[0][0] === this.body[i][0] && this.body[0][1] === this.body[i][1]) {
          return true;
        }
      }
      return wallCollision || snakeCollision;
    };
  
    this.isEatingApple = function (appleToEat){
      let head = this.body[0];
      if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
        return true;
      else
        return false;
    };
  }
  

  //                                                                     ---- Funct Apple ----
  function Apple(position) {
    this.position = position;
    this.draw = function() {
      ctx.save();
      ctx.fillStyle = "#E20000";
      ctx.beginPath();
      let radius = blockSize / 2;
      let x = this.position[0] * blockSize + radius;
      let y = this.position[1] * blockSize + radius;
      ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.restore();
    };
    this.setNewPosition = function() {
      let newX = Math.round(Math.random() * (widthInBlocks - 1));
      let newY = Math.round(Math.random() * (heightInBlocks - 1));
      this.position = [newX, newY];
    };
    this.isOnSnake = function(snakeToCheck) {
      let isOnSnake = false;
      for (let i = 0; i < snakeToCheck.body.length; i++) {
        if (this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]) {
          isOnSnake = true;
        }
      }
      return isOnSnake;
    };
  }
  
//                                                                       ------  KeyBind -----
  document.onkeydown = function handleKeyDown(e) {
    let key = e.code;
    let newDirection;
    switch (key) {
      case "ArrowLeft":
      case "KeyQ":
      case "KeyA":
        newDirection = "left";
        break;
      case "ArrowUp":
      case "KeyZ":
      case "KeyW":
        newDirection = "up";
        break;
      case "ArrowRight":
      case "KeyD":
        newDirection = "right";
        break;
      case "ArrowDown":
      case "KeyS":
        newDirection = "down";
        break;
      case "Space":
      case "Numpad0":
        restart();
        return;
      default:
        return;
    }
    snakee.setDirection(newDirection);
  };
  };
  