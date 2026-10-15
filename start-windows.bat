@echo off
title UNIMINUTO VirtuXperience 3D
cd /d "%~dp0"

echo ========================================================
echo        UNIMINUTO VirtuXperience 3D - Lanzador Windows
echo ========================================================
echo.

where node >nul 2>&1
if errorlevel 1 goto :no_node

if exist node_modules goto :deps_ok
echo [1/3] Instalando dependencias, solo la primera vez...
call npm install
if errorlevel 1 goto :fail
:deps_ok
echo [1/3] Dependencias listas.

if exist dist\index.html goto :build_ok
echo [2/3] Compilando...
call npm run build
if errorlevel 1 goto :fail
:build_ok
echo [2/3] Build listo.

echo [3/3] Iniciando aplicacion...
call npx electron .
if not errorlevel 1 goto :end

echo.
echo [AVISO] Electron no pudo iniciar. Abriendo en el navegador...
start "" http://localhost:5174
call npm run dev
goto :end

:no_node
echo [ERROR] Node.js no esta instalado en este equipo.
echo Descargalo desde https://nodejs.org/ - version LTS
echo Luego vuelve a hacer doble clic en este archivo.
pause
exit /b 1

:fail
echo [ERROR] Algo fallo. Revisa los mensajes de arriba.
pause
exit /b 1

:end
pause
