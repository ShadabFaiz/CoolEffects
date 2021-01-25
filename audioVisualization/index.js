const canvas = document.getElementsByTagName('canvas')[0];
const randomValueBetween = (min, max) =>
    Math.floor(Math.random() * (max - min + 1) + min);
// canvas.width = window.innerWidth - 0.1 * window.innerWidth;
// canvas.height = window.innerHeight - 0.1 * window.innerHeight;

canvas.width = 900;
canvas.height = 300;

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
const colorSection = GUI.addFolder('Wave');
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

analyser.fftSize = 2048;
var bufferLength = analyser.frequencyBinCount;
var dataArray = new Uint8Array(bufferLength);

// audioElement.play();

/**
 * Visualization Part
 */
function draw() {
    requestAnimationFrame(draw);
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.background = `rgba(${canvasConfig.r}, ${canvasConfig.g},${canvasConfig.b},${canvasConfig.opacity})`;

    analyser.getByteTimeDomainData(dataArray);

    // Divide the Canvas width into equal parts.
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
draw();
