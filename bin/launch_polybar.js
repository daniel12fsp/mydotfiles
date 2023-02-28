const downloadWallpaper = require("./downloadWallpaper");
const vibrant = require("node-vibrant");
const fs = require("fs");
const { execSync, spawn } = require("child_process");

function killPolybar() {
  try {
    execSync(`pidof polybar`);
    execSync(`killall -q polybar`);
    execSync(`while pgrep -x polybar >/dev/null; do sleep 1; done`);
  } catch (error) {
    console.log(error);
  }
}

async function main() {
  killPolybar();

  const displays = execSync(`xrandr --listmonitors | awk '{print $4}'`)
    .toString()
    .trim()
    .split("\n");

  const out = fs.openSync("./out.log", "a");
  const err = fs.openSync("./out.log", "a");

  displays.forEach((display) => {
    const subprocess = spawn(
      `polybar`,
      [`-c`, `/home/dfsp/me/mydotfiles/.config/polybar/config.ini`],
      {
        cwd: "/",
        detached: true,
        stdio: ["ignore", out, err],
        env: {
          ...process.env,
          MONITOR: display,
        },
      }
    );
    subprocess.unref();
  });

  const wallpapers = await downloadWallpaper();

  wallpapers.forEach(async ({ path, display }) => {
    console.log(path);
    // console.log(pallete.Vibrant.hex)
    // const polybarConfig = fs.readFileSync('/home/dfsp/me/mydotfiles/.config/polybar/config.ini', 'utf8');
    const theme =
      `
    [colors]
    background =  #2E3440
    ; background for workspace when is selected
    background-alt = #4C566A
    ; value
    foreground = #ECEFF4
    ; key
    primary =  #E5E9F0
    ; sem necessidade
    secondary = #0000FF
    ; sem necessidade
    alert = #FFFF00
    ; sem necessidade
    disabled = #ECEFF4
    `.trim() + "\n";
  });
}



main();
