Add-Type -AssemblyName System.Drawing
$base = Split-Path -Parent $MyInvocation.MyCommand.Path
$src = Join-Path $base 'shots'
$dst = Join-Path $base 'opt'
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 92)

# result screens: crop to the card area (source is 1800x1800, 2x DPR)
$cx = 380; $cy = 490; $cw = 1050; $ch = 1180

foreach ($pattern in @('08-*.png', '09-*.png')) {
  $f = Get-ChildItem -Path $src -Filter $pattern | Select-Object -First 1
  if (-not $f) { "MISSING $pattern"; continue }
  $img = [System.Drawing.Image]::FromFile($f.FullName)
  $rect = New-Object System.Drawing.Rectangle($cx, $cy, $cw, $ch)
  $cropped = New-Object System.Drawing.Bitmap($cw, $ch)
  $g1 = [System.Drawing.Graphics]::FromImage($cropped)
  $g1.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $cw, $ch)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
  $g1.Dispose()

  $w = 900; $h = [int]($ch * $w / $cw)
  $bmp = New-Object System.Drawing.Bitmap($w, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'; $g.SmoothingMode = 'HighQuality'; $g.PixelOffsetMode = 'HighQuality'
  $g.DrawImage($cropped, 0, 0, $w, $h)
  $out = Join-Path $dst ($f.BaseName + '.jpg')
  $bmp.Save($out, $codec, $ep)
  $g.Dispose(); $bmp.Dispose(); $cropped.Dispose(); $img.Dispose()
  "{0,-16} {1}x{2}  {3:N0} KB" -f $f.BaseName, $w, $h, ((Get-Item $out).Length / 1KB)
}
