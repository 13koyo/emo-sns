@echo off
set "PATH=%PATH%;C:\Program Files\nodejs"
cd /d "%~dp0"

echo STOPPING OLD PROCESSES...
taskkill /F /IM node.exe >nul 2>nul
taskkill /F /IM next.exe >nul 2>nul

echo CLEANING CACHE...
if exist ".next" (
    rmdir /s /q ".next"
)

echo Starting emo-sns server...
echo -----------------------------------

REM Try finding npm first
WHERE npm >nul 2>nul
IF %ERRORLEVEL% EQU 0 (
    call npm run dev
) ELSE (
    echo [INFO] npm not found in PATH. Trying direct execution...
    if exist "node_modules\next\dist\bin\next" (
        "C:\Program Files\nodejs\node.exe" "node_modules\next\dist\bin\next" dev
    ) else (
        echo [ERROR] Could not find Next.js executable.
        pause
        exit /b
    )
)

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Server stopped unexpectedly.
    pause
)
