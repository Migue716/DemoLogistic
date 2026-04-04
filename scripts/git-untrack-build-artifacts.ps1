# Quita del indice de Git (no borra archivos en disco) carpetas de dependencias y build.
#   .\scripts\git-untrack-build-artifacts.ps1
# Opcional: -GitExe "C:\Program Files\Git\bin\git.exe"

param([string]$GitExe = "")

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $root

if (-not (Test-Path (Join-Path $root ".git"))) {
    Write-Error "No hay carpeta .git en $root"
    exit 1
}

function Find-GitExecutable {
    param([string]$Explicit)
    if ($Explicit -and (Test-Path $Explicit)) { return (Resolve-Path $Explicit).Path }
    $cmd = Get-Command git -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }
    $candidates = @(
        "$env:ProgramFiles\Git\cmd\git.exe",
        "$env:ProgramFiles\Git\bin\git.exe",
        "${env:ProgramFiles(x86)}\Git\cmd\git.exe",
        "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe",
        "$env:LOCALAPPDATA\Programs\Git\bin\git.exe",
        "$env:USERPROFILE\scoop\shims\git.exe"
    )
    foreach ($p in $candidates) {
        if ($p -and (Test-Path $p)) { return $p }
    }
    $gh = Get-ChildItem -Path "$env:LOCALAPPDATA\GitHubDesktop" -Filter "git.exe" -Recurse -ErrorAction SilentlyContinue -Depth 8 |
        Select-Object -First 1 -ExpandProperty FullName
    if ($gh) { return $gh }
    return $null
}

$gitExe = Find-GitExecutable -Explicit $GitExe
if (-not $gitExe) {
    Write-Error "No se encontro git.exe. Instala Git for Windows, anadelo al PATH, o ejecuta: .\scripts\git-untrack-build-artifacts.ps1 -GitExe `"RUTA\a\git.exe`""
    exit 1
}
Write-Host "Usando Git: $gitExe"

$dirs = @(
    "react/node_modules",
    "angular/node_modules",
    "shiptrack-functions/bin",
    "shiptrack-functions/obj",
    "shiptrack-api/bin",
    "shiptrack-api/obj"
)

foreach ($d in $dirs) {
    & $gitExe -C $root rm -r --cached --ignore-unmatch -- $d
}

# Si aun ves archivos bajo bin/obj/node_modules en "git status", ejecuta una vez:
#   git ls-files | findstr /I "node_modules bin\ obj\ .vite"
# y luego: git rm --cached <ruta>   (o vuelve a correr este script tras mover/renombrar carpetas)

Write-Host ""
Write-Host "Hecho. Revisa: git status"
Write-Host "Siguiente paso sugerido: git add .gitignore && git commit -m ""Dejar de versionar bin, obj y node_modules"""
