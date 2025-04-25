$basePath = $PSScriptRoot

$serviceExe = Join-Path $basePath "TerminalService.exe"
$configExe  = Join-Path $basePath "TerminalConf.exe"

Write-Host "Creating TerminalService.dhml service..."
SC CREATE "TerminalService.dhml" binPath= "`"$serviceExe`"" start= auto description= "TerminalService created by DangHaiMaiLinh 20210529"

Write-Host "Setup room and device ID..."
Start-Process $configExe -Wait

Write-Host "Installation completed successfully!"