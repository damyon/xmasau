
class Controls {

  constructor(canvas) {
    // We set up controls so that we can drag our mouse or finger to adjust the rotation of
    // the camera about the X and Y axes
    this.canvasIsPressed = false;
    this.xRotation = -Math.PI / 5;
    this.yRotation = 0;
    this.xRotation = -Math.PI / 15;
    
    this.x = 0;
    this.y = -4;
    this.z = -200;
    this.maxSpeed = 1;
    this.forwardSpeed = 0;
    this.groundLimit = -0.36;
    this.boatY = 0;
    this.lastPressX;
    this.lastPressY;
    this.keywordProgress = 0;

    this.actionForward = false;
    this.actionBackward = false;
    this.actionRight = false;
    this.actionLeft = false;

    canvas.onmousedown = function (e) {
      this.canvasIsPressed = true;
      this.lastPressX = e.pageX;
      this.lastPressY = e.pageY;
    }.bind(this);
    canvas.onmouseup = function () {
      this.canvasIsPressed = false;
    }.bind(this);
    canvas.onmouseout = function () {
      this.canvasIsPressed = false;
    }.bind(this);
    canvas.onmousemove = function (e) {
      if (this.canvasIsPressed) {
        this.xRotation += (e.pageY - this.lastPressY) / 550;
        this.yRotation -= (e.pageX - this.lastPressX) / 550;

        this.xRotation = Math.min(this.xRotation, Math.PI / 2.5);
        this.xRotation = Math.max(this.xRotation, -Math.PI / 2.5);

        this.lastPressX = e.pageX;
        this.lastPressY = e.pageY;
      }
    }.bind(this);

    window.addEventListener('keydown', function (e) {
      switch(e.keyCode) {
        case 38:
        case 87:
          this.actionForward = true;
          break;
        case 83:
          if (this.keywordProgress == 3) {
            this.keywordProgress++;
          }
          if (this.keywordProgress == 5) {
            this.keywordProgress++;
          }
          if (this.keywordProgress == 8) {
            this.keywordProgress++;
          }
        case 40:
          this.actionBackward = true;
          break;
        case 65:
          if (this.keywordProgress == 9) {
            this.keywordProgress++;
          }
        case 37:
          this.actionLeft = true;
          break;
        case 68:
        case 39:
          this.actionRight = true;
          break;
        case 84:
          if (this.keywordProgress == 0) {
            this.keywordProgress++;
          }
          break;
        case 72:
          if (this.keywordProgress == 1) {
            this.keywordProgress++;
          }
          break;
        case 73:
          if (this.keywordProgress == 2) {
            this.keywordProgress++;
          }
          if (this.keywordProgress == 4) {
            this.keywordProgress++;
          }
          break;
        case 85:
          if (this.keywordProgress == 6) {
            this.keywordProgress++;
          }
          break;
        case 78:
          if (this.keywordProgress == 7) {
            this.keywordProgress++;
          }
          break;
        case 70:
          if (this.keywordProgress == 9) {
            this.keywordProgress++;
          }
          break;
        case 69:
          if (this.keywordProgress == 10) {
            this.keywordProgress = -1;
            this.createSharks = true;
          }
          break;
      }
      
    }.bind(this), false);

    window.addEventListener('keyup', function (e) {
      switch(e.keyCode) {
        case 38:
        case 87:
          this.actionForward = false;
          break;
        case 83:
        case 40:
          this.actionBackward = false;
          break;
        case 65:
        case 37:
          this.actionLeft = false;
          break;
        case 68:
        case 39:
          this.actionRight = false;
          break;
      }
      
    }.bind(this), false);

    // As you drag your finger we move the camera
    canvas.addEventListener('touchstart', function (e) {
      this.lastPressX = e.touches[0].clientX;
      this.lastPressY = e.touches[0].clientY;
    }.bind(this));
    canvas.addEventListener('touchmove', function (e) {
      e.preventDefault();
      this.xRotation += (e.touches[0].clientY - this.lastPressY) / 50;
      this.yRotation += (e.touches[0].clientX - this.lastPressX) / 50;

      this.xRotation = Math.min(this.xRotation, Math.PI / 2.5);
      this.xRotation = Math.max(this.xRotation, 0.1);

      this.lastPressX = e.touches[0].clientX;
      this.lastPressY = e.touches[0].clientY;
    }.bind(this));
  }

  processKeys(terrain, boatWidth, boatLength) {
    if (this.actionForward) {
      this.forwardSpeed += 0.1;
    }
    if (this.actionBackward) {
      this.forwardSpeed -= 0.1;
    }
    if (this.actionLeft) {
      this.boatY -= 0.01;
    }
    if (this.actionRight) {
      this.boatY += 0.01;
    }
    if (this.forwardSpeed) {
      var positionChange = this.moveForward();
          
      let likelyX = this.x - positionChange[0] - boatWidth / 2;
      let likelyZ = this.z + positionChange[2] - boatLength / 2;

      let newDepth = terrain.mapHeight(likelyX, likelyZ);
      if (newDepth <= this.groundLimit) {
        this.x = likelyX + boatWidth / 2;
        this.z = likelyZ + boatLength / 2;
      }
    }
    this.forwardSpeed *= 0.9;
  }

  moveForward() {
    var cameraMatrix = mat4.create();
    var xRotMatrix = mat4.create();
    var yRotMatrix = mat4.create();
    
    //mat4.rotateX(xRotMatrix, xRotMatrix, -this.xRotation);
    mat4.rotateY(yRotMatrix, yRotMatrix, this.boatY);
    //mat4.multiply(cameraMatrix, xRotMatrix, cameraMatrix);
    mat4.multiply(cameraMatrix, yRotMatrix, cameraMatrix);
    mat4.invert(cameraMatrix, cameraMatrix);

    // Speed limit.
    this.forwardSpeed = Math.min(this.forwardSpeed, 0.6);
    this.forwardSpeed = Math.max(this.forwardSpeed, -0.6);
    
    return [cameraMatrix[2] * this.forwardSpeed,
      cameraMatrix[6] * this.forwardSpeed,
      cameraMatrix[10] * this.forwardSpeed
    ];
  }

}
