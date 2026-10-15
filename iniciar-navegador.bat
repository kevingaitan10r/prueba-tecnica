@echo off
title UNIMINUTO VirtuXperience 3D (Modo Navegador Web)
cd /d %~dp0

echo ========================================================
echo   UNIMINUTO VirtuXperience 3D - Modo Navegador Web
echo ========================================================
echo.

where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js no esta instalado en este equipo.
    echo Descarga e instala Node.js (LTS recomendada) desde:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

if not exist node_modules (
    echo Instalando dependencias necesarias...
    call npm install
)

echo Iniciando servidor local y abriendo navegador predeterminado...
start http://localhost:5174
call npm run dev
pause
