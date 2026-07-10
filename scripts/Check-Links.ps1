# Check-Links.ps1 — verifies every external URL published on the site.
# The freshness promise ("Last verified") depends on this running weekly.
# Uses a browser User-Agent: some official-adjacent sites (e.g. TEPCO)
# return 403 to non-browser agents.
#
# Usage: pwsh scripts/Check-Links.ps1   (exit code 1 if any link is broken)

$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$root = Split-Path $PSScriptRoot -Parent
$ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

# Collect URLs from data files and content front matter
$files = @(Get-ChildItem "$root\data" -Filter *.yaml) + @(Get-ChildItem "$root\content" -Recurse -Filter *.md)
$urls = foreach ($f in $files) {
    [regex]::Matches((Get-Content $f.FullName -Raw), 'https?://[^\s"''<>\)\]]+') | ForEach-Object { $_.Value.TrimEnd('.', ',') }
}
$urls = $urls | Where-Object {
    $_ -notmatch '^https://www\.google\.com/maps' -and   # constructed map links
    $_ -notmatch '^https://official\.tokyo\.jp' -and      # self
    $_ -notmatch 'creativecommons\.org'                   # license boilerplate
} | Sort-Object -Unique

Write-Output "Checking $($urls.Count) unique external URLs..."
$failed = @()

foreach ($url in $urls) {
    $ok = $false
    foreach ($attempt in 1..2) {
        try {
            $resp = Invoke-WebRequest -Uri $url -UserAgent $ua -Method Get -TimeoutSec 30 -UseBasicParsing -MaximumRedirection 5
            if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 400) { $ok = $true; break }
        } catch {
            if ($attempt -eq 2) { $err = $_.Exception.Message }
            else { Start-Sleep -Seconds 3 }
        }
    }
    if ($ok) {
        Write-Output "  OK   $url"
    } else {
        Write-Output "  FAIL $url  ($err)"
        $failed += $url
    }
}

Write-Output ""
if ($failed.Count -gt 0) {
    Write-Output "BROKEN LINKS: $($failed.Count) of $($urls.Count)"
    $failed | ForEach-Object { Write-Output "  - $_" }
    Write-Output "Fix or mark these before the next deploy. Do not delete silently — update last_verified when re-verified."
    exit 1
}
Write-Output "All $($urls.Count) links OK."
exit 0
