source ~/.zplug/init.zsh
zplug 'wfxr/forgit'
zplug "zsh-users/zsh-syntax-highlighting", defer:2
zplug 'reegnz/jq-zsh-plugin'
zplug "ddnexus/fm", hook-build:"./fm__compile"
zplug load 


# https://gist.github.com/matthewmccullough/787142
HISTSIZE=20000              #How many lines of history to keep in memory
HISTFILE=~/.zsh_history     #Where to save history to disk
SAVEHIST=20000              #Number of history entries to save to disk
HISTDUP=erase               #Erase duplicates in the history file
setopt    appendhistory     #Append history to the history file (no overwriting)
setopt    sharehistory      #Share history across terminals
setopt    incappendhistory  #Immediately append to the history file, not just when a term is killed

autoload -Uz compinit
compinit

# Variables
# If you come from bash you might have to change your $PATH.
export PATH=$HOME/bin:/usr/local/bin:$HOME/.tools/nvim-linux64/bin:$PATH:/home/daniel/.local/bin:$HOME/.krew/bin:$HOME/node_modules/.bin/:$HOME/.phpenv/bi

export PATH=/usr/local/aws/bin:/home/linx/.cargo/bin:$HOME/.tree-sitter/:$PATH
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Path to your oh-my-zsh installation.
export ZSH="/home/linx/.oh-my-zsh"
export TZ='America/Manaus'
export EDITOR='nvim'
export ZSH_THEME="robbyrussell"
export AWS_PROFILE=systems

plugins=()

source $ZSH/oh-my-zsh.sh

function docker_rm(){
 docker kill $(docker ps -q);docker rm $(docker ps -a -q)
}

alias copy='xclip -selection c'
alias paste='xclip -selection c -o'
alias root='cd $(git rev-parse --show-toplevel)'
alias sbt='./sbt'
alias k='kubectl'



autoload bashcompinit && bashcompinit
complete -C '/usr/local/bin/aws_completer' aws


export PATH="$PATH:`yarn global bin`"

source ~/.virtualenv-autodetect.sh

jqjq() {
    # -F tell less exit if output content can be displayed on one screen
    jq -C "$@" | less -FR
}

rgrg() {
    # -F tell less exit if output content can be displayed on one screen
    rg "$@" --trim -j 20 -p | less -FR
}

mkcd() {
    # -F tell less exit if output content can be displayed on one screen
    mkdir "$@" && cd "$@"
}

kubecd() {
 kubectl config set-context --current --namespace="$@"
}

alias xjq='jqjq'
alias grep='grep --color=always'
alias vim='nvim'
alias ag='ag --pager "less -F" '
alias rg='rgrg'

source /usr/share/doc/fzf/examples/completion.zsh
source /usr/share/doc/fzf/examples/key-bindings.zsh
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
export FZF_DEFAULT_COMMAND="rg --files --hidden --follow --glob '!.git' -j 20"
export FZF_CTRL_T_COMMAND="$FZF_DEFAULT_COMMAND"

[[ /usr/local/bin/kubectl ]] && source <(kubectl completion zsh)
test -r ~/.dir_colors && eval $(dircolors ~/.dir_colors)
eval "$(starship init zsh)"

export PATH="${KREW_ROOT:-$HOME/.krew}/bin:$HOME/.local/bin:$PATH"

source $HOME/.cargo/env

