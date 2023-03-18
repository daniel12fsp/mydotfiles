const execSync = require('child_process').execSync;

const workspaces = JSON.parse(execSync(`i3-msg -t get_workspaces`))
const unfocusedVisibledWorkspace = workspaces.find(p => p.visible && !p.focused)
execSync(`i3-msg "[con_id=\"${unfocusedVisibledWorkspace.id}\"] focus"`)