class offcut {
    pos;
    vel;
    acc;
    size = 75;
    mass = 1;
    rotation;
    rotationSpeed;
    scale = 1;
    color = 'red';

    constructor(x, y, yVelocity, size, color)
    {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);

        this.size = size;
        this.color = color;

        let xVelocity = random(-5, 5);
        this.rotation = random(0, -360);
        this.rotationSpeed = random(-5, 5);

        this.applyForce(createVector(xVelocity, yVelocity));
    }

    applyForce = function (force) {
        this.acc.add(force);
    }

    draw = function () {
        resetMatrix();

        this.rotation = this.rotation + this.rotationSpeed;

        this.applyForce(gravity);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);

        drawingContext.shadowOffsetX = -5;
        drawingContext.shadowOffsetY = constrain((this.pos.y / (windowHeight) * 100) - 10, -10, 50);
        drawingContext.shadowBlur = 5;
        drawingContext.shadowColor = color(0,0,0, 20);

        ellipseMode(CENTER);
        translate(this.pos.x, this.pos.y);
        rotate(this.rotation);
        fill(this.color);
        arc(0, 0, this.size, this.size, 0, 180, PIE);

        drawingContext.shadowOffsetX = 0;
        drawingContext.shadowOffsetY = 0;
        drawingContext.shadowBlur = 0;
    }
}