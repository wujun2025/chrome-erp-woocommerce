# Split Archive Script
# Split large files into multiple parts

# Set parameters
$InputFile = "d:\alproject\chrome-erp-woocommerce-v2\plugin\chrome-erp-woocommerce-v1.0.5.zip"
$MaxSizeMB = 24
$MaxSizeBytes = $MaxSizeMB * 1024 * 1024

# Check if file exists
if (-not (Test-Path $InputFile)) {
    Write-Host "Error: File $InputFile does not exist"
    exit 1
}

# Get file info
$file = Get-Item $InputFile
$fileSize = $file.Length

Write-Host "File Name: $($file.Name)"
Write-Host "File Size: $([math]::Round($fileSize / 1MB, 2)) MB"
Write-Host "Part Size: $MaxSizeMB MB"

# Calculate number of parts needed
$partCount = [math]::Ceiling($fileSize / $MaxSizeBytes)
Write-Host "Number of parts to create: $partCount"

# Open file for reading
$fileStream = [System.IO.File]::OpenRead($file.FullName)
$buffer = New-Object byte[] $MaxSizeBytes
$partNumber = 1

# Create parts
while ($fileStream.Position -lt $fileStream.Length) {
    # Calculate bytes to read
    $remainingBytes = $fileStream.Length - $fileStream.Position
    $bytesToRead = [math]::Min($MaxSizeBytes, $remainingBytes)
    
    # Read data
    $bytesRead = $fileStream.Read($buffer, 0, $bytesToRead)
    
    # Create part file name
    $partFileName = "d:\alproject\chrome-erp-woocommerce-v2\plugin\$($file.BaseName).part$('{0:D3}' -f $partNumber)$($file.Extension)"
    
    # Write part file
    [System.IO.File]::WriteAllBytes($partFileName, $buffer[0..($bytesRead-1)])
    
    Write-Host "Created part: $partFileName ($([math]::Round($bytesRead / 1MB, 2)) MB)"
    
    $partNumber++
}

# Close file stream
$fileStream.Close()

Write-Host "Split archive completed!"