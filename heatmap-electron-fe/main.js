require('electron-reload')(__dirname);

const {
    app,
    BrowserWindow,
    ipcMain
} = require('electron');
// native c++ addons instantiated here
// const addon = require('./build/Release/addon');

let mainWindow;
let heatmap;

const renderer = require('./build/Release/renderer');
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
    [10, 12, 13, 14, 15, 16, 17, 18],
    [34.2, 34, 34.9, 23.1, 34.4, 34.9, 29.3, 24.5],

]
var hmCol = renderer.renderHeatmap(test_data);

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
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('src/calendar.html');
    /*
        mainWindow.webContents.openDevTools({
            mode: 'detach'
        })
        */

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
        width: 800,
        height: 680,
        maxWidth: 800,
        maxHeight: 680,
        backgroundColor: '#FFF',
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    heatmap.on('close', () => {
        heatmap = null;
    });
    heatmap.on('closed', () => {
        heatmap = null;
    });

    heatmap.loadFile('src/heatmap.html');

    heatmap.webContents.openDevTools({
        mode: 'detach'
    });

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
ipcMain.on('minimize-calendar', () => {
    if (mainWindow) {
        mainWindow.minimize();
    }
});

// callback from calendar renderer to quit the program
ipcMain.on('quit-heatmap', () => {
    if (heatmap) {
        heatmap.close();
    }
});

// callback from calendar renderer to minimize the program
ipcMain.on('minimize-heatmap', () => {
    if (heatmap) {
        heatmap.minimize();
    }
});