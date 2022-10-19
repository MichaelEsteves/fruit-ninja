var lineSegments = [],
    maxLineSegments = 5,
    frequency = 3000, // milliseconds between waves
    minFrequency = 1400,
    maxTargets = 1,
    targetLimit = 6,
    nextWave = 0,
    currentWave = 0,
    waveReady = false,
    targets = [],
    offcuts = [],
    drops = [],
    splats = [],
    colors = [],
    gravity;

function setup() {
    frameRate(60);
    angleMode(DEGREES);

    colors.push(color(255, 50, 50));
    colors.push(color(50, 230, 50));
    colors.push(color(75, 75, 255));
    colors.push(color(255, 196, 0));

    gravity = createVector(0, 0.3);
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(255, 255, 255);

     // Draw splats
     for (let i = 0; i < splats.length; i++) {
        const splat = splats[i];
        splat.draw();
    }

    drawMouseLine();

    if (millis() > nextWave && !waveReady) {
        waveReady = true;
        nextWave = nextWave + frequency;
    }

    if (waveReady) {
        // launch a wave
        waveReady = false;
        currentWave++;

        // Update wave frequency every 5 waves
        if (currentWave % 5 === 0) {
            if (frequency > minFrequency) {
                frequency = frequency - 100;
            }
        }

        // Update number of targets every 3 waves
        if (currentWave % 3 === 0) {
            if (maxTargets < targetLimit) {
                maxTargets++;
            }
        }

        let buffer = windowWidth * 0.05;
        let newTargets = random(1, maxTargets);

        for (let i = 0; i < newTargets; i++) {
            let x = random(buffer, windowWidth - buffer);
            targets.push(new target(x, windowHeight, random(colors)));   
        }
    }

    // Draw juice
    for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        drop.draw();
    }

    // Draw offcuts
    for (let i = 0; i < offcuts.length; i++) {
        const offcut = offcuts[i];
        offcut.draw();
    }

    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];        
        target.draw();

        let radius = target.size / 2;

        // Check for mouse collision
        if (!target.isCut) {
            for (let lineIndex = 0; lineIndex < lineSegments.length; lineIndex++) {
                const line = lineSegments[lineIndex];

                // check if the line collides with this shape
                let distance1 = dist(line.x1, line.y1, target.pos.x, target.pos.y);
                let distance2 = dist(line.x2, line.y2, target.pos.x, target.pos.y);

                if (distance1 < radius || distance2 < radius) {
                    target.cut();
                } else {
                    let lineDistance = dist(line.x1, line.y1, line.x2, line.y2);
                    let combinedDistances = distance1 + distance2;
                    let distanceDiff = combinedDistances - lineDistance;

                    // wild arbitrary guesswork that seems close enough
                    if (distanceDiff < 30) {
                        target.cut();
                    }
                }
            }
        }
    }

    // Remove old targets that have gone off screen or been cut
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        if (target.pos.y > windowHeight + 50 || target.isCut == true) {
            targets.splice(i, 1);
        }
    }

    // Remove old offcuts that have gone off screen
    for (let i = 0; i < offcuts.length; i++) {
        const offcut = offcuts[i];
        if (offcut.pos.y > windowHeight + 50) {
            offcuts.splice(i, 1);
        }
    }

    // Remove old juice that has gone off screen
    for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        if (drop.pos.y > windowHeight + 50) {
            drops.splice(i, 1);
        }
    }

    // Remove old splats that have gone transparent
    for (let i = 0; i < splats.length; i++) {
        const splat = splats[i];
        if (splat.color.levels[3] <= 0) {
            splats.splice(i, 1);
        }
    }
}

function drawMouseLine() {
    lineSegments.push({
        x1: mouseX, 
        y1: mouseY,
        x2: pmouseX, 
        y2: pmouseY
    });

    if (lineSegments.length > maxLineSegments) {
        lineSegments.shift();
    }

    let lineColor = color(163, 229, 255);
    let lineWidth = 6;

    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;
    drawingContext.shadowBlur = 10;
    drawingContext.shadowColor = lineColor;

    noFill();
    stroke(lineColor);

    for (let i = 0; i < lineSegments.length; i++) {
        line(lineSegments[i].x1, lineSegments[i].y1, lineSegments[i].x2, lineSegments[i].y2);
        strokeWeight(lineWidth);
        lineWidth += 2;
    }

    strokeWeight(0);

    drawingContext.shadowBlur = 0;
}