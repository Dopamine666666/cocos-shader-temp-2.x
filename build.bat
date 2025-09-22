@echo off
chcp 65001 >nul
echo 正在构建 Cocos Creator 项目...

"C:\ProgramData\cocos\editors\Creator\2.4.13\CocosCreator.exe" --path "./" --build "platform=web-mobile;debug=true;"

echo 构建完成!
echo 正在启动本地服务器...

cd build\web-mobile

echo 正在获取本机IP地址...
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /c:"IPv4"') do (
    for /f "tokens=1" %%j in ("%%i") do (
        set LOCAL_IP=%%j
        goto :ip_found
    )
)
:ip_found

start http-server -p 8000

echo.
echo ========================================
echo 服务器已启动！
echo 本机访问： http://localhost:8000
echo 局域网访问： http://%LOCAL_IP%:8000
echo ========================================
echo 按任意键关闭此窗口...
pause