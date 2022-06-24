const {execSync,exec} = require('child_process');

try {
    const pids = execSync(`pgrep -x spotify`).toString();
    execSync(`playerctl -p spotify play-pause`);
    
} catch (error) {
    exec(`spotify &`);
}
