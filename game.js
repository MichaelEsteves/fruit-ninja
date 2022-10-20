var lineSegments = [],
    maxLineSegments = 5,
    frequency = 3000, // milliseconds between waves
    minFrequency = 1200,
    maxTargets = 1,
    targetLimit = 6,
    bombChance = 0,
    maxBombChance = 0.6,
    nextWave = 0,
    currentWave = 0,
    waveReady = false,
    targets = [],
    offcuts = [],
    drops = [],
    splats = [],
    colors = [],
    start = false,
    gameOver = false;
    score = 0,
    misses = 0,
    bombPenalty = -10,
    allowedMisses = 3,
    gravity = 0;

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

    if (misses >= allowedMisses) {
        start = false;

        if (!gameOver) {
            gameOver = true;
            targets = [];
        }
    }

     // Draw splats
     for (let i = 0; i < splats.length; i++) {
        const splat = splats[i];
        splat.draw();
    }

    drawMouseLine();

    if (start) {
        if (focused) {
            if (millis() > nextWave && !waveReady) {
                waveReady = true;
                nextWave = millis() + frequency;
            }
        
            if (waveReady) {
                // launch a wave
                newWave();
            }
        }
    } else {
        if (targets.length < 1) {
            let startTarget = new target(windowWidth / 2, windowHeight / 2, random(colors));
            startTarget.vel = createVector(0, 0);
            startTarget.acc = createVector(0, 0);
            startTarget.gravity = false;
            startTarget.text = 'START';
            startTarget.rotationSpeed = 0.5;

            startTarget.onCut(function () {
                newGame();
            });

            targets.push(startTarget);
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

    drawScores();

    cleanup();
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

function newWave() {
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

    // update bomb chance every wave
    if (bombChance < maxBombChance) {
        bombChance = bombChance + 0.05;
    }

    let buffer = windowWidth * 0.05;
    let newTargets = random(1, maxTargets);

    for (let i = 0; i < newTargets; i++) {
        let x = random(buffer, windowWidth - buffer);
        let t = new target(x, windowHeight, random(colors));

        t.rotationSpeed = random(-2, 2);
        t.text = '+1';

        t.onCut(function () {
            score++;
        });

        targets.push(t);
    }

    // Add a bomb
    let chance = random(0, 1);

    if (bombChance > chance) {
        let x = random(buffer, windowWidth - buffer);
        let bomb = new target(x, windowHeight, color(0,0,0));

        // bomb.hasOffcuts = false;
        // bomb.hasSplat = false;
        bomb.missable = false;
        bomb.text = bombPenalty;
        bomb.rotationSpeed = random(-2, 2);

        bomb.onCut(function () {
            score = score + bombPenalty;

            if (score < 0) {
                score = 0;
            }
        });

        targets.push(bomb);
    }
}

function cleanup() {
    // Remove old targets that have gone off screen or been cut
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        if (target.pos.y > windowHeight + 50 || target.isCut == true) {
            targets.splice(i, 1);

            if (!target.isCut && target.missable && misses < allowedMisses) {
                misses++;
            }
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

function drawScores() {
    let scoreText = 'Score: ' + score;
    let missesText = 'Misses: ' + misses + '/' + allowedMisses;
    resetMatrix();
    fill('black');
    textSize(40);

    textAlign(LEFT);
    text(scoreText, 50, 50);

    textAlign(RIGHT);
    text(missesText, windowWidth - 50, 50);
}

function newGame()
{
    frequency = 3000;
    maxTargets = 1;
    nextWave = 0;
    currentWave = 0;
    waveReady = false;
    targets = [];
    offcuts = [];
    drops = [];
    splats = [];
    start = true;
    score = 0;
    misses = 0;
    bombChance = 0;
    gameOver = false;
}