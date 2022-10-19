class target {
    pos;
    vel;
    acc;
    size = 100;
    mass = 1;
    isCut = false;
    scale = 1;
    color = 'red';
    maxYVelocity = 24;
    minYVelocity = 10;
    maxYVelocityHeight = 1200;

    constructor(x, y, color)
    {
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);

        this.color = color;

        this.size = this.size * random(0.9, 1.1);

        let variation = random(-2, 2);

        let yVelocity = -(constrain(
            (windowHeight / this.maxYVelocityHeight) * this.maxYVelocity,
            this.minYVelocity,
            this.maxYVelocity
        ) + variation);

        let buffer = windowWidth * 0.2;

        let xVelocity = random(
            x < buffer ? 0 : -2,
            x > (windowWidth - buffer) ? 0 : 2,
        );

        this.applyForce(createVector(xVelocity, yVelocity));
    }

    applyForce = function (force) {
        this.acc.add(force);
    }

    cut = function () {
        if (!this.isCut) {
            this.isCut = true;

            offcuts.push(new offcut(this.pos.x, this.pos.y, this.vel.y, this.size, this.color));
            offcuts.push(new offcut(this.pos.x, this.pos.y, this.vel.y, this.size, this.color));

            let juiceCount = 30;
            for (let index = 0; index < juiceCount; index++) {
                drops.push(new juice(this.pos.x, this.pos.y, this.color));
            }

            splats.push(new splat(this.pos.x, this.pos.y, this.color));
        }
    }

    draw = function () {
        resetMatrix();
        if (!this.isCut) {
            this.applyForce(gravity);
            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);

            drawingContext.shadowOffsetX = -5;
            drawingContext.shadowOffsetY = constrain((this.pos.y / (windowHeight) * 100) - 10, -10, 50);
            drawingContext.shadowBlur = 5;
            drawingContext.shadowColor = color(0,0,0, 20);

    
            scale(this.scale);
            ellipseMode(CENTER);
            fill(this.color);
            ellipse(this.pos.x, this.pos.y, this.size, this.size);

            drawingContext.shadowOffsetX = 0;
            drawingContext.shadowOffsetY = 0;
            drawingContext.shadowBlur = 0;
        }
    }
}