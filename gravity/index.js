const canvas = document.getElementsByTagName('canvas')[0];
canvas.width = window.innerWidth - 0.1 * window.innerWidth;
canvas.height = window.innerHeight - 0.1 * window.innerHeight;

const context = canvas.getContext('2d');

const getRandomColor = (opacity = Math.random()) =>
    `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
    }, ${opacity})`;

const randomIntFromInterval = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);

// const getRandom_X_Y = () => ({
//     x: Math.random() * (canvas.width - 0.001 * canvas.width),
//     y: Math.random() * (canvas.height - 0.001 * canvas.height),
// });
const getRandom_X_Y = () => ({
    x: randomIntFromInterval(0, canvas.width),
    y: randomIntFromInterval(2, 300),
});

const mouse = {
    x: undefined,
    y: undefined,
};

canvas.addEventListener('mousemove', (event) => {
    const rect = event.target.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
});

class Circle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.base_speed = 15;
        this.dx =
            Math.random() * this.base_speed * (Math.random() < 0.5 ? -1 : 1);
        this.dy = 10;
        this.originalRadius = radius;
        this.scalingRadius = this.originalRadius;
        this.radiusScalingSpeed = 2;
        this.color = color;
        this.currentDirection = 'down';
        this.gravity = 1;
        this.friction = 0.95;
    }

    draw = () => {
        context.beginPath();

        // const distanceFromMouse = Math.sqrt(
        //     Math.abs(
        //         Math.pow(mouse.x - this.x, 2) + Math.pow(mouse.y - this.y, 2)
        //     )
        // );

        // if (distanceFromMouse <= 40) {
        //     this.scalingRadius +=
        //         this.scalingRadius < 50 ? this.radiusScalingSpeed : 0;
        // } else if (this.scalingRadius > this.originalRadius) {
        //     this.scalingRadius -= this.radiusScalingSpeed;
        // }

        // if (this.scalingRadius < this.originalRadius)
        //     this.scalingRadius = this.originalRadius;

        context.arc(this.x, this.y, this.originalRadius, Math.PI * 2, false);
        context.strokeStyle = this.color;
        context.fillStyle = context.strokeStyle;
        context.fill();
        context.stroke();
        context.closePath();
    };

    update = () => {
        // If circle reaches to edge on Y Axis bottom, then move in opposite direction.
        if (this.y + this.originalRadius > canvas.height) {
            this.dy = -this.dy * this.friction;
        } else {
            this.dy += this.gravity;
        }

        if (this.y - this.originalRadius <= 0) {
            this.dy = -this.dy;
        }

        if (Number.isNaN(this.x) || Number.isNaN(this.y)) {
            throw 'eerr';
        }

        this.y += this.dy;
        this.draw();
    };
}

let noOfCirclesToCreate = 1;

const circles = [];

function initialize() {
    while (noOfCirclesToCreate--) {
        let { x, y } = getRandom_X_Y();
        const circleRadius = randomIntFromInterval(10, 30);

        if (x <= circleRadius || x >= canvas.width - circleRadius)
            x = circleRadius + 5;
        if (y <= circleRadius || y >= canvas.height - circleRadius)
            y = circleRadius + 5;

        const colors = ['red', '#2f2f2f', '#848484', '#c75f08'];

        const circle = new Circle(
            x,
            y,
            circleRadius,
            colors[randomIntFromInterval(0, colors.length - 1)]
        );
        circles.push(circle);
    }
}

function animate() {
    context.clearRect(0, 0, innerWidth, innerHeight);
    requestAnimationFrame(animate);
    circles.forEach((circle) => circle.update());
}
initialize();
animate();
