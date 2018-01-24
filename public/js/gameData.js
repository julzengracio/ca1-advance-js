let score = 0;
let circles = [];

class Circle {
    constructor(x = 50, y = 50, r = 100, col = '#0f0') {
        this.x = x;
        this.y = y;
        this.r = r;
        this.col = col;
        this.vx = 4;
        this.vy = 4;
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
    };

    draw() {
        fill(this.col);
        ellipse(this.x, this.y, this.r);
    };

}

// bouncing circle that the user must click
class BouncingCircle extends Circle {
    constructor(x, y, r, col = "#0f0") {
        super(x, y, r, col);
    }
    
    // ball bounce from the edges of the canvas
    move() {
        if( this.x + this.vx > width - this.r/2 || this.x + this.vx < this.r/2 ) {
            this.vx = - this.vx;
        }
        if( this.y + this.vy > height - this.r/2 || this.y + this.vy < this.r/2 ) {
            this.vy = - this.vy;
        }

        this.x += this.vx;
        this.y += this.vy;

        // change color of the ball and specify current difficulty to the user
        if (score >= 5) {
            this.x += this.vx * 0.8;
            this.y += this.vy + 0.8;
            this.col = "orange";
            document.getElementById('difficulty').innerHTML = "Medium";
            document.getElementById('difficulty').style.color = "orange";
        }

        if (score >= 10) {
            this.x += this.vx * 0.9;
            this.y += this.vy * 0.9;
            this.col = "red";
            document.getElementById('difficulty').innerHTML = "Hard";
            document.getElementById('difficulty').style.color = "red";
        }
    }

    draw() {
        fill(this.col);
        ellipse(this.x, this.y, this.r);
    }
}

// a faster bouncing cirlce to be generated on certain event
class FastBouncingCircle extends BouncingCircle {
    constructor(x, y, r, col = "#2980b9") {
        super(x, y, r, col);
    }

    // ball bounce from the edges of the canvas
    move() {
        if( this.x + this.vx > width - this.r/2 || this.x + this.vx < this.r/2 ) {
            this.vx = - this.vx;
        }
        if( this.y + this.vy > height - this.r/2 || this.y + this.vy < this.r/2 ) {
            this.vy = - this.vy;
        }

        this.x += this.vx*3;
        this.y += this.vy*3;
    }

    draw() {
        fill(this.col);
        ellipse(this.x, this.y, this.r);
    }
}

// on load set up
function setup() {
    createCanvas(700, 500);
    background(0);
    cursor(HAND, [width], [height]);


    circle = new BouncingCircle(random(20, width-20), random(20, height-20), 70);
    
    document.getElementById('score').innerHTML = score;
    document.getElementById('difficulty').innerHTML = "Easy";
    showHighScore();
    showName();
}

// draw loop
function draw() {
    background(0);
    circle.draw();
    circle.move();

    // draw every circle instantiated from the array
    for (let i = 0; i < circles.length; i++) {
        circles[i].draw();
        circles[i].move();
    }
}

// mouse press event
function mousePressed() {

    // call this functions every press of mouse
    showHighScore();
    createBall();

    // mouse event to check if the ball is clicked
    let circleArea = circle.r/2;
    if (mouseX >= circle.x - circleArea && mouseX < circle.x + circleArea && mouseY >= circle.y - circleArea && mouseY < circle.y + circleArea) {
        console.log("Main Ball clicked!");
        score++;
        document.getElementById('score').innerHTML = score;
        
        // pass the score data to the server.
        fetch('/clicked', {
            method: 'PUT',
            body: JSON.stringify({"score": score}),
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(function(response) {
                if(response.ok) {
                    console.log('Score updated in the database.');
                    return;
                }
                throw new Error('Request failed.');
            })
            .catch(function(error) {
                console.log(error);
            })

    } else {
        console.log("Failed");
    }
}

// function for showing the high score
function showHighScore() {
    fetch('/showScore', {method: 'GET'})
    .then(function(response){
        if(response.ok) return response.json();
        throw new Error('Request failed');
    })
    .then(function(data) {
        console.log(data);
        document.getElementById('highScore').innerHTML = data.score;
    })
    .catch(function(error) {
        console.log(error);
    })
}

// functiion for creating a new ball
function createBall() {
    // add a new ball to the array when a certain condition in game is met.
    if(score === 5) {
        circles.push( new FastBouncingCircle(random(20, width-20), random(20, height-20), 70) );
    }
}
