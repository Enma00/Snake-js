window.onload = function() {
    let canvasWidth = 900;
    let canvasHeight = 600;
    let blockSize = 30;
    let ctx;
    let delay = 100;
    let snakee;
    let applee;
    let widhtInBlocks = canvasWidth/blockSize;
    let heightInBlocks = canvasHeight/blockSize;
  
    init();
  
    function init() {
      let canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      canvas.style.border = "1px solid";
      document.body.appendChild(canvas);
      ctx = canvas.getContext('2d');
      snakee = new Snake([[6, 4], [5, 4], [4, 4]], "right");
      applee = new Apple([10, 10]);
      refreshCanvas();
    }
  
    function refreshCanvas() {
      snakee.advance();
      if (snakee.checkCollision()){
        // Game over
      }
      else{
        if (snakee.isEatingApple(applee))
        {
          applee.setNewPosition()
        }
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        snakee.draw();
        applee.draw();
        setTimeout(refreshCanvas, delay);
      }
      
    }
  
    function drawBlock(ctx, position) {
      let x = position[0] * blockSize;
      let y = position[1] * blockSize;
      ctx.fillRect(x, y, blockSize, blockSize);
    }
  
    function Snake(body, direction) {
      this.body = body;
      this.direction = direction;
      this.draw = function() {
        ctx.save();
        ctx.fillStyle = "#ff0000";
        for (let i = 0; i < this.body.length; i++) {
          drawBlock(ctx, this.body[i]);
        }
        ctx.restore();
      };
      this.advance = function() {
        let nextPosition = this.body[0].slice();
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
        this.body.unshift(nextPosition);
        this.body.pop();
      };
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
      this.checkCollision = function () {
        let wallCollision = false;
        let snakeCollision = false;
        let head = this.body [0];
        let rest = this.body.slice (1);
        let snakeX = head[0];
        let snakeY = head[1];
        let minX = 0;
        let minY = 0;
        let maxX = widhtInBlocks -1;
        let maxY = heightInBlocks -1;
        let isNotBetweenHorizontalwalls = snakeX < minX || snakeX > maxX;
        let isNotBetweenverticalwalls = snakeY < minY || snakeY > maxY;

        if (isNotBetweenHorizontalwalls || isNotBetweenverticalwalls){
          wallCollision = true;
        }

        for (let i = 0; i<rest.lenght; i++){
          if (snakeX == rest[i][0] && snakeY[i][1]){
            snakeCollision = true;
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
      }
    }
  
    function Apple(position) {
      this.position = position;
      this.draw = function() {
        ctx.save();
        ctx.fillStyle = "#33cc33";
        ctx.beginPath();
        let radius = blockSize / 2;
        let x = this.position[0] * blockSize + radius;
        let y = this.position[1] * blockSize + radius;
        ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.restore();
      };
      this.setNewPosition = function()
      {
        let newX = Math.round(Math.random() * (widhtInBlocks - 1));
        let newY = Math.round(Math.random() * (heightInBlocks - 1));
        this.position = [newX, newY];
      };
      this.isOnSnake = function(snakeToCheck)
      {
        let  isOnSnake = false
        for (let i=0; i < snakeToCheck.body.lenght; i++)
        {
          if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck[i][1])
          {
            isOnSnake = true
          }
        }
        return isOnSnake
      }
    }
  
    document.onkeydown = function handleKeyDown(e) {
      let key = e.key.toString();
      let newDirection;
      switch (key) {
        case "ArrowLeft":
          newDirection = "left";
          break;
        case "ArrowUp":
          newDirection = "up";
          break;
        case "ArrowRight":
          newDirection = "right";
          break;
        case "ArrowDown":
          newDirection = "down";
          break;
        default:
          return;
      }
      snakee.setDirection(newDirection);
    };
  };
  