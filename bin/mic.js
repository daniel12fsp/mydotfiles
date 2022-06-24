const execSync = require('child_process').execSync;

const mic = execSync(`amixer -c 0 get Capture`).toString();
console.log(mic.includes('[on]') ? 'On' : 'Off');