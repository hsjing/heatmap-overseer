/**
 * NAN - Native Abstractions for Node.js
 *
 * Copyright (c) 2018 NAN contributors
 *
 * MIT License <https://github.com/nodejs/nan/blob/master/LICENSE.md>
 */
const {
    ipcRenderer
} = require('electron');

const {
    performance
} = require('perf_hooks');

const renderer = require('../build/Release/renderer');

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
    [20, 20, 20, 20, 20, 20, 20, 20]
]

var hmCol = renderer.renderHeatmap(test_data);
document.getElementById("heatmap-slider").min = "0";
document.getElementById("heatmap-slider").max = (hmCol.length - 1).toString();
var slider = document.getElementById("heatmap-slider");

var heatmapCanvas, context, imageData, nodeLayout;

var hmImg = [];

var minT = 15;
var maxT = 35;
var range = maxT - minT;

var r0 = 255;
var g0 = 155;
var b0 = 207;

var r1 = 63;
var g1 = 77;
var b1 = 255;

var rDif = r0 - r1;
var gDif = g0 - g1;
var bDif = b0 - b1;

// Clicking close or minimize buttons
exit.addEventListener('click', function (event) {
    ipcRenderer.send('quit-heatmap');
});

minimize.addEventListener('click', function (event) {
    ipcRenderer.send('minimize-heatmap');
});

function fillHeatmapArray() {
    heatmapCanvas = document.getElementById("heatmap-canvas");
    nodeLayout = document.getElementById("node-layout");

    nodeContext = nodeLayout.getContext("2d", {
        alpha: false
    })

    context = heatmapCanvas.getContext("2d", {
        alpha: false
    });
    imageData = context.getImageData(0, 0, 800, 600);

    for (var i = 0; i < hmCol.length; i++) {
        var clamped = new Uint8ClampedArray(480000 * 4);
        for (var j = 0; j < 480000; j++) {
            var num = hmCol[i][j] - minT;
            clamped[4 * j] = Math.round(r1 + rDif * num / range); // R
            clamped[4 * j + 1] = Math.round(g1 + gDif * num / range); // G
            clamped[4 * j + 2] = Math.round(b1 + bDif * num / range); // B
            clamped[4 * j + 3] = 255; // Alpha
        }
        hmImg[i] = clamped;
    }

    nodeContext.clearRect(0, 0, 800, 600);
    nodeContext.fillStyle = '#FFF';

    nodeContext.font = "bold 15px Helvetica";

    for (var i = 0; i < hmCol[1].length; i++) {
        var x = test_data[0][i << 1];
        var y = test_data[0][(i << 1) + 1];
        //nodeContext.beginPath();
        //nodeContext.arc(x, y, 5, 0, 2 * Math.PI);
        //nodeContext.arc(x, y, 1, 0, 2 * Math.PI);
        //nodeContext.stroke();
        nodeContext.fillText("Node " + i, x, y - 10);
    }
}

fillHeatmapArray();

/**
 * Update the month displayed
 */
function updateHeatmap(index) {
    context.clearRect(0, 0, 800, 600);
    imageData.data.set(hmImg[index]);
    context.putImageData(imageData, 0, 0);
}

//updateHeatmap(0);

slider.oninput = function () {
    updateHeatmap(this.value);
}