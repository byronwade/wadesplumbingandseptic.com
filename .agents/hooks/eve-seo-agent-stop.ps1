[CmdletBinding()]
param(
  [string]$RepositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path,
  [string]$ActiveStatePath = ''
)

$sentinel = Join-Path $RepositoryRoot '.agents\ENABLE_EVE_SEO_AGENT_STOP_HOOK'
if (-not (Test-Path -LiteralPath $sentinel)) {
  Write-Output 'Eve SEO Agent completion gate is disabled (sentinel absent).'
  exit 0
}

try {
  $config = Get-Content -Raw -LiteralPath $sentinel | ConvertFrom-Json
} catch {
  Write-Error 'Completion blocked: hook sentinel is invalid JSON.'
  exit 1
}

if ($config.enabled -ne $true -or $config.max_continuations -isnot [int64] -or $config.max_continuations -lt 0 -or $config.max_continuations -gt 3) {
  Write-Error 'Completion blocked: hook sentinel configuration is invalid.'
  exit 1
}

if (-not $ActiveStatePath -or -not (Test-Path -LiteralPath $ActiveStatePath)) {
  Write-Output 'Eve SEO Agent completion gate is enabled but no active-goal state was supplied; no continuation requested.'
  exit 0
}

try {
  $activeState = Get-Content -Raw -LiteralPath $ActiveStatePath | ConvertFrom-Json
} catch {
  Write-Error 'Completion blocked: active-goal state is invalid JSON.'
  exit 1
}

if ($activeState.goal_active -ne $true) {
  Write-Output 'Eve SEO Agent completion gate observed an inactive goal; no continuation requested.'
  exit 0
}

if ($activeState.continuations_used -isnot [int64] -or $activeState.continuations_used -lt 0) {
  Write-Error 'Completion blocked: active-goal continuation count is invalid.'
  exit 1
}

Push-Location $RepositoryRoot
try {
  & node scripts/verify-completion.mjs
  $completionExit = $LASTEXITCODE
} finally {
  Pop-Location
}

if ($completionExit -eq 0) {
  Write-Output 'Eve SEO Agent completion gate passed.'
  exit 0
}

if ($activeState.continuations_used -lt $config.max_continuations) {
  Write-Output ("CODEX_CONTINUE: completion verification failed while the goal is active; caller may continue once ({0}/{1} continuations used)." -f $activeState.continuations_used, $config.max_continuations)
  exit 2
}

Write-Error ("Completion blocked: verification failed and continuation budget is exhausted ({0}/{1})." -f $activeState.continuations_used, $config.max_continuations)
exit 1
