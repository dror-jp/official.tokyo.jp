# Check-Translations.ps1 — flags translations that are older than their
# English source. English (content/en) is the single source of truth;
# every other language is a generated artifact that must follow it.
#
# Staleness = the EN file's last git commit is newer than the translated
# file's last git commit. Informational (exit 0 with report) — stale
# translations are a to-do, not a build failure.

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$langs = @("ja", "zh", "vi", "ne")

function LastCommit($path) {
    $t = git -C $root log -1 --format=%ct -- $path 2>$null
    if ($t) { [long]$t } else { 0 }
}

$enFiles = Get-ChildItem "$root\content\en" -Recurse -Filter *.md |
    Where-Object { $_.FullName -notmatch "\\api\\" }

$stale = @()
$missing = @()

foreach ($f in $enFiles) {
    $rel = $f.FullName.Substring("$root\content\en\".Length)
    $enTime = LastCommit "content/en/$($rel -replace '\\','/')"
    foreach ($lang in $langs) {
        $tPath = "content/$lang/$($rel -replace '\\','/')"
        if (Test-Path "$root\$tPath") {
            $tTime = LastCommit $tPath
            if ($enTime -gt $tTime) { $stale += "$tPath (EN source updated since translation)" }
        } else {
            $missing += $tPath
        }
    }
}

Write-Output "Checked $($enFiles.Count) EN source files x $($langs.Count) languages."
if ($stale.Count -gt 0) {
    Write-Output ""
    Write-Output "STALE translations ($($stale.Count)) - retranslate these:"
    $stale | ForEach-Object { Write-Output "  - $_" }
}
if ($missing.Count -gt 0) {
    Write-Output ""
    Write-Output "MISSING translations ($($missing.Count)):"
    $missing | ForEach-Object { Write-Output "  - $_" }
}
if ($stale.Count -eq 0 -and $missing.Count -eq 0) {
    Write-Output "All translations are present and up to date with their EN sources."
}
exit 0
