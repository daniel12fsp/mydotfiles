const execSync = require('child_process').execSync;

const args = process.argv.slice(2)
const windowIndex = parseInt(args[0])
const state = JSON.parse(execSync(`swaymsg -t get_tree`))

const currentWorkspace =  parseInt(state.nodes.flat().find(i => i.active).current_workspace)
const nodes = state.nodes.find(i => i.active).nodes[0].nodes
const window = windowIndex == -1? nodes.pop() : nodes[windowIndex]

execSync(`swaymsg '[con_id="${window.id}"] focus'`)