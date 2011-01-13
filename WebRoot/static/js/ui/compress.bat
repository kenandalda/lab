@echo off 
if exist ui.js del /F /S /Q ui.js
if exist ui.css del /F /S /Q ui.css
tc2 compress.xml .
if exist output del /F /S /Q output
