@echo off
setlocal enabledelayedexpansion
title UNIMINUTO VirtuXperience 3D
cd /d %~dp0

echo ========================================================
echo        UNIMINUTO VirtuXperience 3D - Lanzador Windows
echo ========================================================
echo.

:: 1. Verificar si Node.js esta instalado en el sistema
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js no esta instalado en este equipo.
    echo Para ejecutar el proyecto, descarga e instala Node.js (version LTS recomendada):
    echo https://nodejs.org/
    echo.
    echo Una vez instalado, vuelve a hacer doble clic sobre este archivo.
    echo ========================================================
    pause
    exit /b 1
)

:: 2. Instalar dependencias si es la primera ejecucion
if not exist node_modules (
    echo [1/3] Instalando dependencias (Three.js, Vite, Electron)...
    echo Esto solo toma unos segundos en la primera ejecucion...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Fallo la instalacion de dependencias con npm.
        pause
        exit /b 1
    )
) else (
    echo [1/3] Dependencias verificadas.
)

:: 3. Compilar el paquete de produccion si no existe dist
if not exist dist\index.html (
    echo [2/3] Compilando experiencia virtual...
    call npm run build
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Fallo la compilacion con Vite.
        pause
        exit /b 1
    )
) else (
    echo [2/3] Bundle de produccion listo.
)

:: 4. Lanzar aplicacion de escritorio con fallback a navegador
echo [3/3] Iniciando aplicacion...
call npx electron .
if %ERRORLEVEL% neq 0 (
    echo.
    echo [AVISO] Electron no pudo iniciar directamente en esta maquina.
    echo Abriendo automaticamente en tu navegador web predeterminado...
    echo.
    start http://localhost:5174
    call npm run dev
)

echo.
echo Sesion finalizada.
pause
