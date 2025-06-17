# Tự khởi chạy lại script với quyền admin nếu chưa có
if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(`
    [Security.Principal.WindowsBuiltInRole] "Administrator")) {

    $arguments = "& '" + $myinvocation.mycommand.definition + "'"
    Start-Process powershell -Verb runAs -ArgumentList $arguments
    exit
}


$basePath = Split-Path -Parent $MyInvocation.MyCommand.Definition

$serviceExe = Join-Path $basePath "TerminalService.exe"
$configExe  = Join-Path $basePath "TerminalConf.exe"

if (!(Test-Path $serviceExe)) {
    Write-Host "TerminalService.exe not found"
    Read-Host "Press any key to exit..."
    exit
}

if (!(Test-Path $configExe)) {
    Write-Host "TerminalConf.exe not found tại"
    Read-Host "Press any key to exit..."
    exit
}

$ServiceName = "DHMLTerminalService"
$DisplayName = "DHML Terminal Service"

# ===== TẠO SERVICE =====

# Kiểm tra xem service đã tồn tại chưa
$existingService = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
if ($existingService) {
    Write-Host "Service '$ServiceName' is existed."
} else {
    # Tạo Service nếu chưa tồn tại
    Write-Host "Creating Windows service '$ServiceName'..."
    $cmdCreate = 'sc.exe create "{0}" binpath= "{1}" start= auto displayname= "{2}"' -f $ServiceName, $serviceExe, $DisplayName
    Invoke-Expression $cmdCreate 

    $cmdDes = 'sc.exe description "{0}" "TerminalService created by DangHaiMaiLinh 20210529"' -f $ServiceName
    Invoke-Expression $cmdDes 

    # Cấu hình tự động khởi động lại nếu bị dừng
    Write-Host "Configuring auto-restart on failure..."
    $cmdConf = 'sc.exe failure "{0}" reset= 0 actions= restart/5000/restart/5000/restart/5000' -f $ServiceName
    Invoke-Expression $cmdConf 
}

# Khởi động service
Write-Host "Starting service '$ServiceName'..."
    $cmdStart = 'sc.exe start "{0}"' -f $ServiceName
    Invoke-Expression $cmdStart 

# Gọi config
Write-Host "Configuring room and device ID..."
Start-Process $configExe -Wait

# Hoàn tất
Write-Host "Installation completed successfully."
Read-Host "Press any key to exit..."
