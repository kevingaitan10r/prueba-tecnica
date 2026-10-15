@echo off
echo === UNIMINUTO VirtuXperience 3D ===
cd /d %~dp0

if not exist node_modules (
    echo Instalando dependencias...
    call npm install
)

echo Compilando aplicacion...
call npm run build

echo Iniciando aplicacion...
call npx electron .
pause
