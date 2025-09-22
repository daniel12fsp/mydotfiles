const execSync = require("child_process").execSync;

const [displayer, position] = process.argv.slice(2);
const tree = JSON.parse(execSync(`i3-msg -t get_tree`));

function getProgramWindowNodes(root) {
  if (!root || typeof root !== "object") {
    return []; // Return empty array for null or non-object root
  }

  let programNodes = [];

  if (Array.isArray(root.nodes) && root.nodes.length > 0) {
    root.nodes.forEach((node) => {
      programNodes = programNodes.concat(getProgramWindowNodes(node)); // Concatenate results from recursive calls
    });
  } else {
    if (root.window_type === "normal" && root.window_properties) {
      programNodes.push(root);
    }
  }
  return programNodes;
}

const allWindows = getProgramWindowNodes(tree);

const filtedWindows = allWindows.filter((w) => w.output === displayer);

const selectedWindow = filtedWindows[position];
console.log({ selectedWindow });
execSync(`i3-msg "[con_id=\"${selectedWindow.id}\"] focus"`);
