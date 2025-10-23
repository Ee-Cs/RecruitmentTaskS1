@echo off
cd ..
::goto :serve

:build_and_start
call ng build
cd dist\RecruitmentTaskS1\browser
start "Recruitment Task S1" /MAX http-server . -p 8080
pause
goto :eof

:serve
call ng serve
pause