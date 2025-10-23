@echo off
set SITE=https://api.spacexdata.com
set CURL=curl --globoff --silent --header "Accept: application/json" --header "Content-Type: application/json"
set JQ=d:\tools\jq\jq-win64.exe
set NO_COLOR=Y

set HR_YELLOW=@powershell -Command Write-Host "----------------------------------------------------------------------" -foreground "Yellow"
set HR_RED=@powershell    -Command Write-Host "----------------------------------------------------------------------" -foreground "Red"


%HR_YELLOW%
@powershell -Command Write-Host "Launchpads Query" -foreground "Green"
%CURL% -d @queries/LaunchpadsQuery.json  -X POST "%SITE%/v4/launchpads/query" | %JQ% .
@echo.
::pause

%HR_YELLOW%
@powershell -Command Write-Host "Launches Query" -foreground "Green"
%CURL% -d @queries/launchesQuery.json  -X POST "%SITE%/v5/launches/query" | %JQ% .
@echo.
::pause

%HR_YELLOW%
@powershell -Command Write-Host "Rockets Query" -foreground "Green"
%CURL% -d @queries/rocketsQuery.json  -X POST "%SITE%/v4/rockets/query" | %JQ% .
@echo.
::pause

%HR_YELLOW%
@powershell -Command Write-Host "Crew Query" -foreground "Green"
%CURL% -d @queries/crewQuery.json  -X POST "%SITE%/v4/crew/query" | %JQ% .
@echo.


%HR_RED%
@powershell -Command Write-Host "FINISH" -foreground "Red"
pause