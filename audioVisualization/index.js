const canvas = document.getElementsByTagName('canvas')[0];
const randomValueBetween = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);
canvas.width = window.innerWidth - 0.4 * window.innerWidth;
canvas.height = window.innerHeight - 0.6 * window.innerHeight;
let visualizationType = 'wave';

document
    .getElementById('visualization-type')
    .addEventListener('change', (event) => {
        visualizationType = event.target.value;
    });

const context = canvas.getContext('2d');

const waveProperties = {
    amplitude: 100,
    longitude: 0.0141,
    speed: 0.009
};

const GUI = new dat.GUI();

const waveSection = {
    r: randomValueBetween(0, 255),
    g: randomValueBetween(0, 255),
    b: randomValueBetween(0, 255),
    opacity: 1,
    thickness: 1
};
const colorSection = GUI.addFolder('Visualization');
colorSection.add(waveSection, 'r', 0, 255);
colorSection.add(waveSection, 'g', 0, 255);
colorSection.add(waveSection, 'b', 0, 255);
colorSection.add(waveSection, 'opacity', 0.1, 1);
colorSection.add(waveSection, 'thickness', 1, 20);
colorSection.open();

const canvasConfig = {
    r: 24,
    g: 49,
    b: 94,
    opacity: 1
};

const canvasBackground = GUI.addFolder('Background');
canvasBackground.add(canvasConfig, 'r', 0, 255);
canvasBackground.add(canvasConfig, 'g', 0, 255);
canvasBackground.add(canvasConfig, 'b', 0, 255);
canvasBackground.add(canvasConfig, 'opacity', 0, 1);
canvasBackground.open();

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();

const pannerOptions = { pan: 0 };
const pannerControl = document.querySelector('#panner');
const panner = new StereoPannerNode(audioContext, pannerOptions);

pannerControl.addEventListener(
    'input',
    function () {
        panner.pan.value = this.value;
    },
    false
);

// Input
const audioElement = document.querySelector('audio');

// Source
const audioSource = audioContext.createMediaElementSource(audioElement);

// Modification / Capture
const analyser = audioContext.createAnalyser();

// Output
audioSource.connect(analyser).connect(panner).connect(audioContext.destination);

analyser.fftSize = 512;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

/**
 * Visualization Part
 */
function draw() {
    requestAnimationFrame(draw);
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.background = `rgba(${canvasConfig.r}, ${canvasConfig.g},${canvasConfig.b},${canvasConfig.opacity})`;

    switch (visualizationType) {
        case 'circle':
            return createCircularWave();
        case 'bar':
            return createBars();
        case 'wave':
            return createWave();
    }
}

function createBars() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    analyser.getByteFrequencyData(dataArray);

    const sliceWidth = (canvas.width * 1.0) / bufferLength;
    const boxWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;
    let y = 0;

    context.fillStyle = `rgba(${waveSection.r}, ${waveSection.g}, ${waveSection.b}, ${waveSection.opacity})`; // Color of line
    context.lineWidth = waveSection.thickness;

    for (let index = 0; x + boxWidth < canvas.width; index++) {
        context.fillRect(
            x,
            canvas.height - dataArray[index],
            boxWidth,
            dataArray[index]
        );
        x += boxWidth + 2;
    }
}

function createWave() {
    analyser.getByteTimeDomainData(dataArray);

    const sliceWidth = (canvas.width * 1.0) / bufferLength;
    let x = 0;
    let y = 0;

    // Move to left center
    context.beginPath();
    context.strokeStyle = `rgba(${waveSection.r}, ${waveSection.g}, ${waveSection.b}, ${waveSection.opacity})`; // Color of line
    context.lineWidth = waveSection.thickness;

    for (let index = 0; index < bufferLength; index++) {
        y = dataArray[index];
        context.lineTo(x, y);

        x += sliceWidth;
    }

    context.stroke(); // Draw Line
}

function drawBar2(x1, y1, x2, y2, width, frequency) {
    var lineColor = `rgba(${waveSection.r}, ${waveSection.g}, ${waveSection.b}, ${waveSection.opacity})`;

    context.strokeStyle = lineColor;
    context.lineWidth = width;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}
function createCircularWave() {
    let center_x = canvas.width / 2;
    let center_y = canvas.height / 2;
    let radius = 50;
    let bars = 200;
    analyser.getByteFrequencyData(dataArray);

    //draw a circle
    context.beginPath();
    context.arc(center_x, center_y, radius, 0, 2 * Math.PI);
    context.stroke();
    for (var i = 0; i < bars; i++) {
        //divide a circle into equal parts
        let rads = (Math.PI * 2) / bars;
        let bar_height = dataArray[i] * 0.5;

        let bar_width = 2;
        let x = center_x + Math.cos(rads * i) * radius;
        let y = center_y + Math.sin(rads * i) * radius;
        let x_end = center_x + Math.cos(rads * i) * (radius + bar_height);
        let y_end = center_y + Math.sin(rads * i) * (radius + bar_height);
        drawBar2(x, y, x_end, y_end, bar_width, dataArray[i]);
    }
}
draw();
