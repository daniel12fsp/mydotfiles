# For change all shell for all user change in /etc/inputrc
set -o vi 
# If you come from bash you might have to change your $PATH.
export PATH=$HOME/bin:/usr/local/bin:$PATH:$HOME/.cargo/bin

# Path to your oh-my-zsh installation.
export ZSH="/home/daniel/.oh-my-zsh"


export EDITOR=vim
export TERMINAL=kitty
export TerminalEmulator=kitty

export PYTHONPATH=$PYTHONPATH:$HOME/.python/.libs

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
 

ZSH_THEME="robbyrussell"

plugins=(git vi-mode)

source $ZSH/oh-my-zsh.sh

alias copy='xclip -selection c'
alias paste='xclip -selection c -o'
