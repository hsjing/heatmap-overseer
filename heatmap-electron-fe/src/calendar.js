/**
 * NAN - Native Abstractions for Node.js
 *
 * Copyright (c) 2018 NAN contributors
 *
 * MIT License <https://github.com/nodejs/nan/blob/master/LICENSE.md>
 */

const {ipcRenderer} = require('electron');

let monthDict = {
    1: 'January',
    2: 'Feburary',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
};

let d = new Date();
let currentMonth = d.getMonth() + 1;
let currentYear = d.getFullYear();
document.getElementById('currentMonth').innerHTML = monthDict[currentMonth];
document.getElementById('currentYear').innerHTML = currentYear;

const monthSelBac = document.getElementById('monthSelBac');
const daysCollection = document.getElementsByClassName('weekdays');

// Clicking close or minimize buttons
exit.addEventListener('click', function(event) {
    ipcRenderer.send('quit-all');
});

minimize.addEventListener('click', function(event) {
    ipcRenderer.send('minimize-main');
});

// Clicking month selectors (forward)
monthSelBac.addEventListener('click', function(event) {
    if (currentMonth == 1) {
        currentMonth = 12;
        currentYear--;
    } else {
        currentMonth--;
    }
    updateMonth();
});

// (backward)
monthSelFor.addEventListener('click', function(event) {
    if (currentMonth == 12) {
        currentMonth = 1;
        currentYear++;
    } else {
        currentMonth++;
    }
    updateMonth();
});

// Clicking home
homeSel.addEventListener('click', function(event) {
    let d = new Date();
    currentMonth = d.getMonth() + 1;
    currentYear = d.getFullYear();
    updateMonth();
});

/**
 * Update the month displayed
 */
function updateMonth() {
    let firstDayOfMonth = new Date(currentYear, currentMonth-1, 1);
    let firstWeekday = firstDayOfMonth.getDay();
    let daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    for (let i = 0; i < daysCollection.length; i++) {
        daysCollection[i].innerHTML = '';
    }

    for (let i = 0; i < daysInMonth; i++) {
        daysCollection[firstWeekday+i].innerHTML = i+1;
    }
    document.getElementById('currentYear').innerHTML = currentYear;
    document.getElementById('currentMonth').innerHTML = monthDict[currentMonth];
}

updateMonth();

for (let item of daysCollection) {
    // on click, open heatmap with attributes date, month, year
    item.addEventListener('click', function(event) {
        ipcRenderer.send('open-heatmap',
        item.innerHTML, // date
        currentMonth, // month
        currentYear // year
    );
});
}


