@echo off
REM ==========================================================
REM  PUBLISH THE BLOG
REM  Double-click this after pasting a new post into
REM  blog\_src\posts.txt. It rewrites the listing, every post
REM  page, the feed and the sitemap together.
REM ==========================================================
cd /d "%~dp0.."
where perl >nul 2>nul
if errorlevel 1 (
  echo.
  echo   Perl is not installed on this machine.
  echo   Install Strawberry Perl from strawberryperl.com, then run this again.
  echo.
  pause
  exit /b 1
)
perl bloguild.pl
if errorlevel 1 (
  echo.
  echo   Nothing was published. Read the message above: it names the post
  echo   and what is wrong with it.
  echo.
) else (
  echo.
  echo   Done. Upload the blog folder and sitemap.xml.
  echo.
)
pause
