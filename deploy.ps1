#requires -Version 7.0
param(
  [Parameter(Mandatory = $true)][string]$Message
)

$ErrorActionPreference = 'Stop'

# ===== CONFIG SEMPLICE =====
# Useremo i remoti che hai già: pubblico = origin, privato = beta
$PublicRemoteName  = "origin"
$PrivateRemoteName = "beta"
$Branch            = "main"
$ArtifactsDir      = "dist"
# Costruiamo localmente e pubblichiamo noi su ENTRAMBE le release:
$BuildCmd          = 'npm run build -- --publish never'
# Formati tipici degli artefatti (estendi se serve)
$AssetGlobs        = @("*.exe","*.msi","*.dmg","*.pkg","*.AppImage","*.deb","*.rpm","*.zip","*.tar.gz","*.yml","*.blockmap")
# ===========================

function Step([string]$m){ Write-Host "`n==> $m" -ForegroundColor Cyan }
function Info([string]$m){ Write-Host $m }
function Fail([string]$m){ Write-Error $m; exit 1 }

function Require-Cmd([string]$cmd,[string]$hint){
  if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) { Fail "Manca '$cmd'. $hint" }
}

function Get-RepoFullNameFromUrl([string]$url){
  if ($url -match 'github\.com[:/](.+?)/(.+?)(\.git)?$'){
    return "$($Matches[1])/$($Matches[2])"
  }
  return $null
}

function Collect-Assets([string]$dir, [string[]]$globs){
  if (-not (Test-Path $dir)) { Fail "Cartella build non trovata: '$dir'." }
  $files = @()
  foreach($g in $globs){
    $files += Get-ChildItem -Path $dir -Recurse -Filter $g -File -ErrorAction SilentlyContinue
  }
  $files | Select-Object -Unique
}

function Create-Or-Update-Release([string]$repo, [string]$tag, [System.IO.FileInfo[]]$assets, [string]$title, [string]$notes){
  # Se la release esiste, la eliminiamo e ricreiamo per avere stato pulito
  & gh release view $tag -R $repo *> $null
  if ($LASTEXITCODE -eq 0){
    Step "Rimuovo release esistente '$tag' su $repo"
    & gh release delete $tag -R $repo -y *> $null
  }
  Step "Creo release '$tag' su $repo"
  $assetArgs = @()
  foreach($a in $assets){ $assetArgs += $a.FullName }
  & gh release create $tag -R $repo --title $title --notes $notes @assetArgs
  if ($LASTEXITCODE -ne 0){ Fail "Creazione release fallita su $repo." }
}

try{
  Step "Controlli iniziali"
  Require-Cmd git "Installa Git."
  Require-Cmd gh  "Installa GitHub CLI (winget install GitHub.cli)."
  Require-Cmd node "Installa Node.js."
  Require-Cmd npm  "Installa Node.js (include npm)."

  # Assicuro GH_TOKEN in questa sessione
  if (-not $env:GH_TOKEN) {
    $tok = [Environment]::GetEnvironmentVariable("GH_TOKEN","User")
    if ($tok) { $env:GH_TOKEN = $tok } else { Fail "GH_TOKEN mancante. Impostalo e riapri PowerShell." }
  }

  Step "Verifico remoti Git"
  $pubUrl = git remote get-url $PublicRemoteName
  if ($LASTEXITCODE -ne 0) { Fail "Remoto pubblico '$PublicRemoteName' non trovato." }
  $priUrl = git remote get-url $PrivateRemoteName
  if ($LASTEXITCODE -ne 0) { Fail "Remoto privato '$PrivateRemoteName' non trovato." }

  Step "Git add/commit (solo se ci sono cambi)"
  git add -A
  git diff --cached --quiet
  if ($LASTEXITCODE -ne 0){
    git commit -m $Message | Out-Null
  } else {
    Info "Nessuna modifica da committare: proseguo."
  }

  Step "Push su remoto pubblico ($PublicRemoteName/$Branch)"
  git push $PublicRemoteName $Branch

  Step "Push su remoto privato ($PrivateRemoteName/$Branch)"
  git push $PrivateRemoteName $Branch

  Step "Build locale (senza pubblicazione automatica)"
  cmd /c $BuildCmd
  if ($LASTEXITCODE -ne 0){ Fail "Build fallita. Controlla l'errore qui sopra." }

  Step "Raccolgo gli artefatti"
  $assets = Collect-Assets $ArtifactsDir $AssetGlobs
  if (-not $assets -or $assets.Count -eq 0){ Fail "Nessun artefatto trovato in '$ArtifactsDir'." }

  # Tag univoco basato su data/ora
  $ts  = Get-Date -Format "yyyyMMdd-HHmmss"
  $tag = "deploy-$ts"
  $title = "Build $ts"
  $notes = "Commit: $Message"

  Step "Ricavo owner/repo da remoti"
  $pubRepo = Get-RepoFullNameFromUrl $pubUrl
  $priRepo = Get-RepoFullNameFromUrl $priUrl
  if (-not $pubRepo) { Fail "Impossibile leggere owner/repo dal remoto pubblico ($pubUrl)." }
  if (-not $priRepo) { Fail "Impossibile leggere owner/repo dal remoto privato ($priUrl)." }

  Step "Release su PUBBLICO ($pubRepo)"
  Create-Or-Update-Release $pubRepo $tag $assets $title $notes

  Step "Release su PRIVATO ($priRepo)"
  Create-Or-Update-Release $priRepo $tag $assets $title $notes

  Step "FATTO ✅  (tag: $tag)"
  Write-Host "Release create su:" -ForegroundColor Green
  Write-Host " - $pubRepo ($tag)"
  Write-Host " - $priRepo ($tag)"
  exit 0
}
catch{
  Fail ("Errore: " + $_.Exception.Message)
}