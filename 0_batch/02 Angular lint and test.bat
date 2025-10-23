@echo off
cd ..
call ng version
call ng lint
call ng build
start /MAX ng test
pause