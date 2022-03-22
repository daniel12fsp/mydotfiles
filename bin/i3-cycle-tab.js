const execSync = require('child_process').execSync;

const args = process.argv.slice(2)
const windowIndex = parseInt(args[0])
const state = JSON.parse(execSync(`swaymsg -t get_tree`))

const currentWorkspace =  state.nodes;

function getLeaves(root) {
    const nodes = root.nodes;
    const results = [];
    while (nodes.length) {
        const node = nodes.shift()
        if (node.nodes.length > 0) {
            nodes.push(...node.nodes)
        } else {
            results.push(node)
        }
    }
    return results
}

const programNodes = getLeaves(state)
const unfocusedVisibledWindow = programNodes.find(p => p.visible && !p.focused)
execSync(`swaymsg '[con_id="${unfocusedVisibledWindow.id}"] focus'`)

