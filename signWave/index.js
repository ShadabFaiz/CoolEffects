// const getRandomColor = (opacity = Math.random()) =>
//     `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
//         Math.random() * 255
//     }, ${opacity})`;
const randomValueBetween = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);

const canvas = document.getElementsByTagName('canvas')[0];
canvas.width = window.innerWidth - 0.1 * window.innerWidth;
canvas.height = window.innerHeight - 0.1 * window.innerHeight;

const context = canvas.getContext('2d');

const waveProperties = {
    amplitude: 100,
    longitude: 0.0141,
    speed: 0.009
};

const GUI = new dat.GUI();
const waveSection = GUI.addFolder('wave');
waveSection.add(waveProperties, 'amplitude', -200.1, 200);
waveSection.add(waveProperties, 'longitude', -0.1, 1);
waveSection.add(waveProperties, 'speed', -0.1, 1);
waveSection.open();

const color = {
    r: randomValueBetween(0, 255),
    g: randomValueBetween(0, 255),
    b: randomValueBetween(0, 255),
    opacity: 1
};
const colorSection = GUI.addFolder('color');
colorSection.add(color, 'r', 0, 255);
colorSection.add(color, 'g', 0, 255);
colorSection.add(color, 'b', 0, 255);
colorSection.add(color, 'opacity', 0.1, 1);
colorSection.open();

let speed = waveProperties.speed;

function animate() {
    requestAnimationFrame(animate);

    // context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(0,0,0,0.008)';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.beginPath();

    context.moveTo(0, canvas.height / 2); // Left Center
    for (let index = 0; index < canvas.width; index++) {
        context.lineTo(
            index,
            canvas.height / 2 +
                Math.sin(index * waveProperties.longitude + speed) *
                    waveProperties.amplitude *
                    Math.sin(speed)
        );
    }
    speed += waveProperties.speed;
    context.strokeStyle = `rgba(${color.r} , ${color.g}, ${color.b}, ${color.opacity})`;
    context.stroke();
}
animate();
