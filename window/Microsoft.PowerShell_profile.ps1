# C:\Users\dfsp\Documents\PowerShell\Microsoft.PowerShell_profile.ps1
# Windows - $HOME\Documents\PowerShell\Microsoft.PowerShell_profile.ps1
$env:Path="C:\Program Files\Git\bin;C:\msys64\home\dfsp\.sdkman\candidates\java\current;C:\Users\dfsp\Documents\node\v12;$($env:Path);"
$env:JAVA_HOME = "C:\msys64\home\dfsp\.sdkman\candidates\java\current"

function wildfly {
  Invoke-Expression 'C:\wildfly-14.0.0.Final\bin\standalone.bat -c standalone-full.xml -b 0.0.0.0'
}

echo "[Variaveis Path e Java alterado]";