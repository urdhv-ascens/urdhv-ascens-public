$src = 'c:\Users\D.Solanki\urdhv-ascens\apps\main-site\out'
$dst = 'c:\Users\D.Solanki\urdhv-ascens\urdhv-ascens-admin\public_html'

# Copy admin directory
Copy-Item -Path "$src\admin\*" -Destination "$dst\admin" -Recurse -Force

# Copy _next directory
Copy-Item -Path "$src\_next\*" -Destination "$dst\_next" -Recurse -Force

# Copy assets directory if exists
if (Test-Path "$src\assets") {
    Copy-Item -Path "$src\assets\*" -Destination "$dst\assets" -Recurse -Force
}

# Copy legal pages
Copy-Item -Path "$src\privacy\*" -Destination "$dst\privacy" -Recurse -Force
Copy-Item -Path "$src\refund-policy\*" -Destination "$dst\refund-policy" -Recurse -Force
Copy-Item -Path "$src\terms\*" -Destination "$dst\terms" -Recurse -Force

# Copy root html and media files (excluding .htaccess and _redirects)
Get-ChildItem -Path $src -File | Where-Object { $_.Name -ne '_redirects' -and $_.Name -ne '.htaccess' } | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination "$dst\$($_.Name)" -Force
}

Write-Host "Synchronization to public_html complete."
