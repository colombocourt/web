# ============================================================
#  BLOG PICTURES
#
#  Drop photographs into these two folders and run this. It makes
#  every size the website needs and gives them the right names.
#
#    blog\_new-pictures\header\   the big picture at the top of a post
#    blog\_new-pictures\inside\   pictures that go in the middle of it
#
#  Name each file for what it is, in lower case with dashes:
#
#    ceylon-tea.jpg      ->  bl-ceylon-tea-hero-560/900/1600.jpg
#    tea-plantation.jpg  ->  bl-tea-plantation-700/1100.jpg
#
#  A header picture is cropped to 16:9 because that is the shape of
#  the band it sits in. An inside picture is cropped to 3:2.
#  Nothing is stretched: the middle of the frame is kept.
#
#  Run it by double-clicking blog\add-pictures.cmd
# ============================================================
Add-Type -AssemblyName System.Drawing

$ROOT = Split-Path -Parent $PSScriptRoot
$IN   = Join-Path $PSScriptRoot '_new-pictures'
$OUT  = Join-Path $ROOT 'assets\img'
$jpeg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }

foreach ($sub in 'header', 'inside') {
  $p = Join-Path $IN $sub
  if (-not (Test-Path $p)) { New-Item -ItemType Directory -Path $p -Force | Out-Null }
}

function Save-Jpeg($bmp, $path, $quality) {
  $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int]$quality)
  $bmp.Save($path, $jpeg, $ep); $ep.Dispose()
}

function Make-Sizes($file, $name, $aspect, $widths) {
  $img = [System.Drawing.Image]::FromFile($file.FullName)
  try {
    # a photograph off a phone carries its rotation in the file rather
    # than in the pixels, so turn it the right way up first
    if ($img.PropertyIdList -contains 274) {
      switch ($img.GetPropertyItem(274).Value[0]) {
        3 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
        6 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
        8 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
      }
    }
  } catch {}

  $sw = $img.Width; $sh = $img.Height
  if (($sw / $sh) -gt $aspect) { $cw = [int]($sh * $aspect); $ch = $sh } else { $cw = $sw; $ch = [int]($sw / $aspect) }
  $cx = [int](($sw - $cw) / 2); $cy = [int](($sh - $ch) / 2)

  $made = @()
  foreach ($w in $widths) {
    if ($w -gt $cw) {
      Write-Host ("   ! {0} is only {1} pixels wide, so it cannot make the {2} size." -f $file.Name, $cw, $w) -ForegroundColor Yellow
      Write-Host "     Use a larger original, or the picture will look soft." -ForegroundColor Yellow
      continue
    }
    $th = [int][Math]::Round($w * $ch / $cw)
    $bmp = New-Object System.Drawing.Bitmap($w, $th); $bmp.SetResolution(72, 72)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $w, $th)), $cx, $cy, $cw, $ch, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $path = Join-Path $OUT "$name-$w.jpg"
    Save-Jpeg $bmp $path 80
    $bmp.Dispose()
    $made += ("{0}-{1}.jpg  {2} KB" -f $name, $w, [int]((Get-Item $path).Length / 1KB))
  }
  $img.Dispose()
  return $made
}

function Clean-Name($file) {
  $n = [System.IO.Path]::GetFileNameWithoutExtension($file.Name).ToLower()
  $n = $n -replace '[^a-z0-9]+', '-'
  $n = $n -replace '^-+|-+$', ''
  if ($n -eq '') { $n = 'picture' }
  return $n
}

Write-Host ""
Write-Host "  Looking in blog\_new-pictures" -ForegroundColor Cyan
Write-Host ""

$total = 0

foreach ($job in @(
  @{ folder = 'header'; suffix = '-hero'; aspect = 1.7778; widths = @(560, 900, 1600); what = 'top of a post, 16:9' },
  @{ folder = 'inside'; suffix = '';      aspect = 1.5;    widths = @(700, 1100);      what = 'inside a post, 3:2' }
)) {
  $dir = Join-Path $IN $job.folder
  $files = Get-ChildItem $dir -File -Include *.jpg, *.jpeg, *.png, *.JPG, *.JPEG, *.PNG -Recurse -ErrorAction SilentlyContinue
  if (-not $files) { continue }

  Write-Host ("  $($job.folder)  ($($job.what))") -ForegroundColor Cyan
  foreach ($f in $files) {
    $name = 'bl-' + (Clean-Name $f) + $job.suffix
    Write-Host ("   $($f.Name)  ->  $name")
    try {
      $made = Make-Sizes $f $name $job.aspect $job.widths
      foreach ($m in $made) { Write-Host "     $m" -ForegroundColor DarkGray }
      $total++
    } catch {
      Write-Host "     ! could not read that file: $($_.Exception.Message)" -ForegroundColor Red
    }
  }
  Write-Host ""
}

if ($total -eq 0) {
  Write-Host "  Nothing to do. Put your photographs in:" -ForegroundColor Yellow
  Write-Host "    blog\_new-pictures\header\   the big one at the top"
  Write-Host "    blog\_new-pictures\inside\   the ones in the middle"
  Write-Host ""
} else {
  Write-Host "  Done. $total picture(s) made, in assets\img" -ForegroundColor Green
  Write-Host ""
  Write-Host "  In blog\compose.html, use the names on the right above:" -ForegroundColor Cyan
  Write-Host "  the -hero one as the main picture, the others as the second and third."
  Write-Host ""
  Write-Host "  You can now delete the originals from _new-pictures if you like." -ForegroundColor DarkGray
  Write-Host ""
}
