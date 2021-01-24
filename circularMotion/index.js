const canvas = document.getElementsByTagName('canvas')[0];
canvas.width = window.innerWidth - 0.1 * window.innerWidth;
canvas.height = window.innerHeight - 0.1 * window.innerHeight;

const context = canvas.getContext('2d');

const getRandomColor = (opacity = Math.random()) =>
    `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
    }, ${opacity})`;

// We will use it get random color, distance of circles from center, radius of circular motions
const randomValueBetween = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);

// Used to keep track of Mouse position
const mouse = {
    x: undefined,
    y: undefined
};

canvas.addEventListener('mousemove', (event) => {
    const rect = event.target.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
});

function Circle(x, y, color, rotate = true) {
    this.x = x;
    this.y = y;
    this.originalRadius = randomValueBetween(1, 7);
    this.color = color;
    this.radian = Math.random() * Math.PI * 2;
    this.velocity = 0.02; // This will control the speed of circular motion;
    this.distanceFromCenter = randomValueBetween(100, 200);

    this.draw = (lastPosition) => {
        context.beginPath();
        context.strokeStyle = this.color;
        context.lineWidth = this.originalRadius;
        context.moveTo(lastPosition.x, lastPosition.y);
        context.lineTo(this.x, this.y);
        context.stroke();
        context.closePath();
    };

    this.update = () => {
        if (Number.isNaN(this.x) || Number.isNaN(this.y)) {
            throw 'x and y are not number';
        }
        const lastPosition = { x: this.x, y: this.y };
        this.radian += this.velocity;
        if (rotate) {
            this.x =
                (mouse.x ? mouse.x : x) +
                Math.cos(this.radian) * this.distanceFromCenter;
            this.y =
                (mouse.y ? mouse.y : y) +
                Math.sin(this.radian) * this.distanceFromCenter;
        }
        this.draw(lastPosition);
    };
}

let noOfCirclesToCreate = 100;

const circles = [];

function initialize() {
    while (noOfCirclesToCreate--) {
        const colors = ['red', '#2f2f2f', '#848484', '#c75f08'];

        const circle = new Circle(
            canvas.width / 2,
            canvas.height / 2,
            colors[randomValueBetween(0, colors.length - 1)]
        );
        circles.push(circle);
    }
}

function animate() {
    context.fillStyle = 'rgba(255, 255, 255, 0.1)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(animate);
    circles.forEach((circle) => circle.update());
}
initialize();
animate();
