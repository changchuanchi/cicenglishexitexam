# shots/*.png (2x PNG) -> opt/*.jpg (1200px wide, JPEG q90)
# NOTE: this file deliberately contains NO Chinese characters.
# PowerShell 5.1 reads .ps1 as ANSI; Chinese literals become mojibake and file lookups fail.
Add-Type -AssemblyName System.Drawing

$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$src = Join-Path $base 'shots'
$dst = Join-Path $base 'opt'
New-Item -ItemType Directory -Force $dst | Out-Null

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 90)

$total = 0
foreach ($f in Get-ChildItem "$src\*.png" | Sort-Object Name) {
  $img = [System.Drawing.Image]::FromFile($f.FullName)
  $w = 1200
  $h = [int]($img.Height * $w / $img.Width)
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.SmoothingMode = 'HighQuality'
  $g.PixelOffsetMode = 'HighQuality'
  $g.DrawImage($img, 0, 0, $w, $h)
  $out = Join-Path $dst ($f.BaseName + '.jpg')
  $bmp.Save($out, $codec, $ep)
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
  $kb = (Get-Item $out).Length / 1KB
  $total += $kb
  "{0,-20} {1,6:N0} KB" -f $f.BaseName, $kb
}
"----"
"total {0:N0} KB" -f $total
