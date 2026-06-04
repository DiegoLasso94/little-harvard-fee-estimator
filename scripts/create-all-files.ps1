# Writes all project files. Uses Node.js when available (see create-all-files.mjs).
$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path $PSScriptRoot -Parent
$Generator = Join-Path $PSScriptRoot "create-all-files.mjs"

function Find-NodeExe {
  $candidates = @(
    "$env:ProgramFiles\nodejs\node.exe",
    "${env:ProgramFiles(x86)}\nodejs\node.exe",
    "$env:LOCALAPPDATA\Programs\node\node.exe"
  )
  foreach ($path in $candidates) {
    if (Test-Path $path) { return $path }
  }
  $cmd = Get-Command node -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  return $null
}

$node = Find-NodeExe
if (-not $node) {
  Write-Host "Node.js is required to regenerate files from scripts/project-sources.mjs." -ForegroundColor Yellow
  Write-Host "Install Node from https://nodejs.org/ then run: npm run create-files"
  Write-Host "Source files are already present in: $ProjectRoot"
  exit 0
}

& $node $Generator
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
