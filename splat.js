class splat {
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
    drops = [];

    constructor(x, y, c)
    {
        this.color = color(c.levels[0], c.levels[1], c.levels[2]);

        let dropCount = random(10, 50);

        for (let i = 0; i < dropCount; i++) {
            this.drops.push({
                x: random(x - 50, x + 50),
                y: random(y - 50, y + 50),
                size: random(2, 30),
            });
        }
    }

    draw = function () {
        resetMatrix();
        this.alpha = this.alpha - 2;
        this.color.setAlpha(this.alpha);

        ellipseMode(CENTER);
        fill(this.color);

        strokeWeight(0);

        for (let i = 0; i < this.drops.length; i++) {
            const drop = this.drops[i];
            ellipse(drop.x, drop.y, drop.size, drop.size);    
        }
    }
}