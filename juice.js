class juice {
    pos;
    vel;
    acc;
    size = 75;
    mass = 1;
    rotation;
    rotationSpeed;
    scale = 1;
    color = 'red';
    alpha = 255;

    constructor(x, y, c)
    {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);

        this.size = random(10, 50);
        this.color = color(c.levels[0], c.levels[1], c.levels[2]);

        let xVelocity = random(-6, 6);
        let yVelocity = random(-10, 0);

        this.applyForce(createVector(xVelocity, yVelocity));
    }

    applyForce = function (force) {
        this.acc.add(force);
    }

    draw = function () {
        resetMatrix();

        this.applyForce(gravity);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);

        this.alpha = this.alpha - 4;
        this.size = constrain(this.size - 1, 0, 100);

        this.color.setAlpha(this.alpha);

        strokeWeight(0);

        ellipseMode(CENTER);
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.size, this.size);
    }
}