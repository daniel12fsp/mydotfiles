"Colocar Numeros na esquerda
set clipboard=unnamedplus
set number

"Mapear teclas com algum comando
map <F2> :read !perl -e '@a=map{int(rand(99))}(1..10); print join "\n",@a;' <CR>
map <F7> : !clear && echo "Python works" && pypy % <CR>
map <F5> : !clear && echo @* <CR>
map <F6> : !./exec.sh <CR> <Esc>
map <F8> : !clear && echo "GCC works" && gcc -std=c99 % -g && ./a.out <CR>
map <F9> : !clear && echo "GDB works" && gcc -std=c99 -Wall % -g  <CR>

syntax on
"Para habilitar o mouse
set mouse=a

"Para define o tab = 4 espaço
set tabstop=4
set shiftwidth=4
set softtabstop=4
set wildmenu

"Identacao automatica
set backspace=indent,eol,start
set autoindent
set visualbell
