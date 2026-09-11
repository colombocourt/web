@echo off
REM ==========================================================
REM  MAKE THE BLOG PICTURES
REM  Put your photographs in blog\_new-pictures\header and
REM  blog\_new-pictures\inside, then double-click this.
REM ==========================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0make-pictures.ps1"
pause
