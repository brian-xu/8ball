let font,
  fontsize = 32;

class Ball {
  constructor(x, y, color, number) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.number = number;
    this.striped = number > 8;
    this.angle = 0;
    this.velocity = 0;
    this.curFrame = 0;
    this.prevRot = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }
  update() {
    this.curFrame += this.velocity;
    this.updateAngle();
    this.angle = a.value();
    this.curFrame = 0;
    this.velocity = b.value();
  }
  updateAngle() {
    let cosT = Math.cos(this.curFrame);
    let sinT = Math.sin(this.curFrame);
    let u_x = Math.cos((this.angle * PI) / 180);
    let u_y = Math.sin((this.angle * PI) / 180);
    let curRot = [
      [
        cosT + u_x * u_x * (1 - cosT),
        u_x * u_y * (1 - cosT),
        -1 * u_y * sinT,
        0
      ],
      [u_x * u_y * (1 - cosT), cosT + u_y * u_y * (1 - cosT), u_x * sinT, 0],
      [u_y * sinT, -1 * u_x * sinT, cosT, 0],
      [0, 0, 0, 1]
    ];
    this.prevRot = math.flatten(
      math.multiply(curRot, [
        this.prevRot.slice(0, 4),
        this.prevRot.slice(4, 8),
        this.prevRot.slice(8, 12),
        this.prevRot.slice(12, 16)
      ])
    );
  }
  cap(start, end) {
    translate(0, 0, start);
    fill(this.color);
    circle(0, 0, 2 * Math.sqrt(end * end - start * start) + 0.5);
    erase();
    for (let i = start; i <= end; i += 0.5) {
      translate(0, 0, 0.5);
      circle(0, 0, 2 * Math.sqrt(end * end - i * i));
    }
    noErase();
  }
  draw() {
    this.update();
    push();
    translate(this.x, this.y);
    fill(this.color);
    circle(0, 0, 100);
    rotate(this.curFrame, [
      Math.cos((this.angle * PI) / 180),
      Math.sin((this.angle * PI) / 180),
      0
    ]);
    applyMatrix(this.prevRot);
    this.cap(45, 50, 0);
    fill(0);
    translate(0, 0, 1);
    text(this.number, 0, 10);
    if (this.striped) {
      translate(0, 0, -51);
      rotateX(PI / 2);
      this.cap(30, 50, 0);
      translate(0, 0, -50);
      rotateX(-PI);
      this.cap(30, 50, 0);
    }
    pop();
  }
}

function setup() {
  createCanvas(600, 1033, WEBGL);
  ortho(0, 2400, 4133, 0);
  ellipseMode(CENTER);

  a = createSlider(-180, 180, 0);
  a.position(10, 10);
  a.style("width", "80px");
  b = createSlider(0, 1, 0, 0.01);
  b.position(10, 30);
  b.style("width", "80px");

  ball = new Ball(0, 0, 0, 0);
  ball2 = new Ball(1200, -2000, "#ff0000", 15);
  // Ensure the .ttf or .otf font stored in the assets directory
  // is loaded before setup() and draw() are called
  font = loadFont(
    "https://raw.githubusercontent.com/adobe-fonts/source-sans/release/OTF/SourceSans3-Black.otf"
  );

  // Set text characteristics
  textFont(font);
  textSize(30);
  textAlign(CENTER);
}

function table() {
  push();
  background("#0a827d");
  strokeWeight(2);
  fill("#643232");
  beginShape();
  vertex(0, 0);
  vertex(1200, 0);
  vertex(1200, -333);
  vertex(493, -333);
  vertex(413, -253);
  vertex(253, -413);
  vertex(333, -493);
  vertex(333, -1952);
  vertex(253, -1952);
  vertex(253, -2180);
  vertex(333, -2180);
  vertex(333, -3640);
  vertex(253, -3720);
  vertex(413, -3880);
  vertex(493, -3800);
  vertex(1200, -3800);
  vertex(1200, -4133);
  vertex(0, -4133);
  endShape(CLOSE);
  pop();
}

function draw() {
  table();
  ball.draw();
  ball2.draw();
}
