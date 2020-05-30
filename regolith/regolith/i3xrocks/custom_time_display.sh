date=$(date +"%a %b(%m)/%d")
mao=$(TZ="America/Manaus"   date +"%H:%M(MAO)")
sp=$(TZ="America/Sao_Paulo" date +"%H:%M(SP)")
echo "${date} ${mao} | ${sp}";