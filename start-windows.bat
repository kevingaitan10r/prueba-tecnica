@echo off
echo ======================================================================
echo    UNIMINUTO VirtuXperience 3D - Virtual Experience Engineering SAS   
echo ======================================================================
cd /d %~dp0

if not exist node_modules (
    echo Instalando dependencias...
    call npm install
)

echo Compilando aplicacion...
call npm run build

echo Lanzando ejecutable...
call npx electron .
pause
