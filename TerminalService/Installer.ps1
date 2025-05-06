$basePath = $PSScriptRoot

$serviceExe = Join-Path $basePath "TerminalService.exe"
$configExe  = Join-Path $basePath "TerminalConf.exe"

Write-Host "Creating DHML-Terminal Service service..."
SC CREATE "DHMLTerminalService" displayname="DHML-Terminal Service" binPath= "`"$serviceExe`"" start= auto description= "TerminalService created by DangHaiMaiLinh 20210529"

Write-Host "Setup room and device ID..."
Start-Process $configExe -Wait

Write-Host "Installation completed successfully!"