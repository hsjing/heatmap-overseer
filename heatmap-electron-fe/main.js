require('electron-reload')(__dirname);
const {
    PerformanceObserver,
    performance
} = require('perf_hooks');

const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron');

const addon = require('./build/Release/addon');

// testing area
var end = 8;
var start = 0;

var test_data = [
    [
        50, 50, // node a
        50, 100, // node b
        50, 150, // node c
        50, 200, // node e
        100, 50, // node f
        100, 100, // node g
        100, 150, // node h
        100, 200 // node i
    ],
    // a, b, c, d, e, f, g, h, i
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 20, 20, 24, 190],
    [21, 21, 50, 10, 21, 20, 24, 121]
]

var t0 = performance.now();
console.log(addon.renderHeatmap(test_data));
var t1 = performance.now();

console.log("Call to test took " + (t1 - t0) + " milliseconds.");


// native c++ addons instantiated here
// const addon = require('./build/Release/addon');

let mainWindow;
let heatmap;

/* main direct access to mysql - FOR TESTING PURPOSES
const mysql = require('mysql');
const url = require('url');
const path = require('path');
// create mysql instance
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootaccess',
    databse: 'mydb'
});
// connect instance
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

*/

/**
 * main window function on startup
 */
function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 700,
        height: 700,
        maxWidth: 700,
        maxHeight: 700,
        backgroundColor: '#FFF',
        frame: false,
    });

    mainWindow.loadFile('src/calendar.html');

    // mainWindow.webContents.openDevTools({mode: 'detach'})

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

// Listen for app to be ready
app.on('ready', createMainWindow);

// quit app on closing all windows
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    };
});

// recreate window if app is reactivated AND window currently closed
app.on('activate', () => {
    if (mainWindow == null) {
        createMainWindow();
    }
});

/**
 * create heatmap window
 */
function createHeatmap() {
    heatmap = new BrowserWindow({
        width: 700,
        height: 680,
        resizable: false,
        backgroundColor: '#FFF',
        frame: false,
    });

    heatmap.on('close', () => {
        heatmap = null;
    });
    heatmap.on('closed', () => {
        heatmap = null;
    });

    heatmap.loadFile('src/heatmap.html');

    // heatmap.webContents.openDevTools();
};

// callback from calendar renderer to open a new heatmap window
ipcMain.on('open-heatmap', (event, date, month, year) => {
    if (!heatmap) {
        createHeatmap();
    } else {
        heatmap.close();
        createHeatmap();
    }
});

// callback from calendar renderer to quit the program
ipcMain.on('quit-all', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// callback from calendar renderer to minimize the program
ipcMain.on('minimize-main', () => {
    if (mainWindow) {
        mainWindow.minimize();
    }
});