require('electron-reload')(__dirname);

const {app, BrowserWindow, ipcMain} = require('electron');

// native c++ addons instantiated here
// const addon = require('./build/Release/addon');

let mainWindow; let heatmap;

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
        width: 700, height: 700,
        maxWidth: 700, maxHeight: 700,
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
        width: 700, height: 680, resizable: false, backgroundColor: '#FFF',
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

