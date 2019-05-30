// Requires
const {
    ipcRenderer
} = require('electron');

const {
    performance
} = require('perf_hooks');

const renderer = require('../build/Release/renderer');

// Some test data
var test_data = [
    [
        160, 180, // node a
        300, 230, // node b
        430, 180, // node c
        640, 200, // node e
        110, 460, // node f
        320, 400, // node g
        480, 380, // node h
        640, 400 // node i
    ],
    // a, b, c, d, e, f, g, h, i
    [20, 20, 20, 20, 20, 20, 20, 20],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [31, 31, 31, 31, 33, 19, 19, 19],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [31, 31, 31, 31, 33, 19, 19, 19],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [31, 31, 31, 31, 33, 19, 19, 19],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [31, 31, 31, 31, 33, 19, 19, 19],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [31, 31, 31, 31, 33, 19, 19, 19],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [31, 31, 31, 31, 33, 19, 19, 19],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [31, 31, 31, 31, 33, 19, 19, 19],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [31, 31, 31, 31, 33, 19, 19, 19],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [31, 31, 31, 31, 33, 19, 19, 19],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [31, 31, 31, 31, 33, 19, 19, 19],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [31, 31, 31, 31, 33, 19, 19, 19],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [20, 20, 20, 20, 20, 20, 20, 20],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [31, 31, 31, 31, 33, 19, 19, 19],
    [30, 30, 30, 30, 28, 16, 16, 17],
    [29, 29, 29, 29, 24, 22, 21, 29],
    [28, 28, 28, 28, 24, 27, 21, 29],
    [27, 27, 27, 27, 24, 23, 23, 24],
    [26, 26, 26, 26, 24, 23, 23, 24],
    [25, 25, 25, 25, 24, 23, 23, 24],
    [24, 24, 24, 24, 24, 24, 24, 24],
    [23, 23, 23, 23, 23, 23, 23, 23],
    [22, 22, 22, 22, 22, 22, 22, 22],
    [21, 21, 21, 21, 21, 21, 21, 21],
    [20, 20, 20, 20, 20, 20, 20, 20]
]
var test_data1 = [
    [
        160, 180, // node a
        300, 230, // node b
        430, 180, // node c
        640, 200, // node e
        110, 460, // node f
        320, 400, // node g
        480, 380, // node h
        640, 400 // node i
    ],
    // a, b, c, d, e, f, g, h, i
    [10, 12, 13, 14, 15, 16, 17, 18],
    [34.2, 34, 34.9, 23.1, 34.4, 34.9, 29.3, 24.5],

]

// Process the data, check for rendering time
var t0 = performance.now();
var hmCol = renderer.renderHeatmap(test_data);
var t1 = performance.now();
console.log(t1 - t0);

// Configure sliders
document.getElementById("heatmap-slider").min = "0";
document.getElementById("heatmap-slider").max = (hmCol.length - 1).toString();

// Hook temperature display and slider
var displayTemp = document.getElementById("temp");
var slider = document.getElementById("heatmap-slider");

var heatmapCanvas,
    context,
    imageData,
    nodeLayout,
    roomOverlay,
    heatmapCount = 0;

// Clicking close or minimize buttons
exit.addEventListener('click', function (event) {
    ipcRenderer.send('quit-heatmap');
});

minimize.addEventListener('click', function (event) {
    ipcRenderer.send('minimize-heatmap');
});

// Fill heatmap
function fillHeatmapArray() {
    heatmapCanvas = document.getElementById("heatmap-canvas");
    nodeLayout = document.getElementById("node-layout");
    roomOverlay = document.getElementById("room-layout");

    nodeContext = nodeLayout.getContext("2d", {
        alpha: false
    });

    context = heatmapCanvas.getContext("2d", {
        alpha: false
    });

    imageData = context.getImageData(0, 0, 800, 600);

    nodeContext.clearRect(0, 0, 800, 600);
    nodeContext.fillStyle = '#FFF';

    nodeContext.font = "bold 15px Helvetica";

    for (var i = 0; i < hmCol[1].length; i++) {
        var x = test_data[0][i << 1];
        var y = test_data[0][(i << 1) + 1];
        nodeContext.beginPath();
        nodeContext.arc(x, y, 5, 0, 2 * Math.PI);
        nodeContext.arc(x, y, 1, 0, 2 * Math.PI);
        nodeContext.stroke();
        nodeContext.fillText("Node " + i, x, y - 10);
    }
}

// Fill canvas with heatmap
function updateHeatmap(index) {
    context.clearRect(0, 0, 800, 600);
    imageData.data.set(hmCol[index]);
    context.putImageData(imageData, 0, 0);
}

// Slide through heatmaps on scroll
slider.oninput = function () {
    heatmapCount = this.value;
    updateHeatmap(this.value);
}

// Temperature on hover
roomOverlay.onmousemove = function (e) {
    var index = e.clientX + e.clientY * 800;

    var validTempFromHeatmap = ((hmCol[heatmapCount][index * 4] - 63) * 20 / 192) + 15;

    if (!isNaN(validTempFromHeatmap))
        displayTemp.innerHTML = validTempFromHeatmap.toFixed(3);
}

// Init
fillHeatmapArray();
updateHeatmap(0);