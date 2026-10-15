@echo off
title UNIMINUTO VirtuXperience 3D - Navegador
cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 goto :no_node

if exist node_modules goto :run
echo Instalando dependencias, solo la primera vez...
call npm install
if errorlevel 1 goto :fail

:run
echo Abriendo http://localhost:5174 ...
start "" http://localhost:5174
call npm run dev
goto :end

:no_node
echo [ERROR] Node.js no esta instalado en este equipo.
echo Descargalo desde https://nodejs.org/ - version LTS
pause
exit /b 1

:fail
echo [ERROR] Fallo la instalacion de dependencias.
pause
exit /b 1

:end
pause
