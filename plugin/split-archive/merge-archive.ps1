# Merge Archive Script
# Merge split parts back into original file

# Set parameters
$OutputFile = "d:\alproject\chrome-erp-woocommerce-v2\plugin\chrome-erp-woocommerce-v1.0.5-merged.zip"
$PartPattern = "d:\alproject\chrome-erp-woocommerce-v2\plugin\chrome-erp-woocommerce-v1.0.5.part*.zip"

# Get all part files
$partFiles = Get-ChildItem $PartPattern | Sort-Object Name

if ($partFiles.Count -eq 0) {
    Write-Host "Error: No part files found matching pattern $PartPattern"
    exit 1
}

Write-Host "Found $($partFiles.Count) part files:"
foreach ($part in $partFiles) {
    Write-Host "  $($part.Name) ($([math]::Round($part.Length / 1MB, 2)) MB)"
}

# Create output file
$outputStream = [System.IO.File]::Create($OutputFile)

# Merge parts
foreach ($part in $partFiles) {
    Write-Host "Processing $($part.Name)..."
    $partBytes = [System.IO.File]::ReadAllBytes($part.FullName)
    $outputStream.Write($partBytes, 0, $partBytes.Length)
}

# Close output stream
$outputStream.Close()

Write-Host "Merge completed! Output file: $OutputFile"
Write-Host "Output file size: $([math]::Round((Get-Item $OutputFile).Length / 1MB, 2)) MB"