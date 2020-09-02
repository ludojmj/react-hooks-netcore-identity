#!/bin/bash
step=0
STEPS=4

clear

let "step++"
printf "\n************************** $step/$STEPS : Building client...\n"
cd client
npm run build

let "step++"
printf "\n************************** $step/$STEPS : Moving client build to wwwroot server folder...\n"
rm -rf ../Server/wwwroot/
mv -f build ../Server/
mv ../Server/build ../Server/wwwroot

let "step++"
printf "\n************************** $step/$STEPS : Testing server...\n"
pwd
cd ../Server.UnitTest
dotnet test

let "step++"
printf "\n************************** $step/$STEPS : Building server...\n"
cd ../Server
dotnet build --configuration Release

cd ..
printf "\nDone.\n\n"
# export ASPNETCORE_ENVIRONMENT=Production
# dotnet run
