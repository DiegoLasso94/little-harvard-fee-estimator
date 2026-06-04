# Creates all project source files and installs dependencies.
$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot

function Find-NodeExe {
  $candidates = @(
    "$env:ProgramFiles\nodejs\node.exe",
    "$env:ProgramFiles (x86)\nodejs\node.exe",
    "$env:LOCALAPPDATA\Programs\node\node.exe",
    "$env:USERPROFILE\scoop\apps\nodejs\current\node.exe",
    "$env:USERPROFILE\AppData\Roaming\nvm\*\node.exe"
  )
  foreach ($path in $candidates) {
    $resolved = Resolve-Path $path -ErrorAction SilentlyContinue
    if ($resolved) { return $resolved[0].Path }
  }
  $cmd = Get-Command node -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  return $null
}

Write-Host "Childcare Fee Calculator - automatic setup" -ForegroundColor Cyan
Write-Host "Project: $ProjectRoot`n"

$node = Find-NodeExe
if (-not $node) {
  Write-Host "Node.js not found. Install from https://nodejs.org/ then run this script again." -ForegroundColor Red
  exit 1
}

Write-Host "Using Node: $node"
& powershell -NoProfile -ExecutionPolicy Bypass -File "$ProjectRoot\scripts\create-all-files.ps1"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$npm = Join-Path (Split-Path $node) "npm.cmd"
if (-not (Test-Path $npm)) { $npm = "npm" }

Write-Host "`nInstalling dependencies..."
Set-Location $ProjectRoot
& $npm install
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "`nDone. Start the app with: npm run dev" -ForegroundColor Green
