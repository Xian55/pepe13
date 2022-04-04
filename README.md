# pepe-bot13

Discord.js v13 bot written in TypeScript. 

## Basic Features

1. Permission based slash commands.
1. Per channel toggleable Chat Filter system.
1. Data stored in MongoDB

## Slash Commands and Events
1. Music playback
1. Darkest Dungeon and Overwatch soundboard
1. Yu-Gi-Oh card generator
1. Tic-Tac-Toe game
1. Poll generator
1. Roll and 8Magic ball
1. Urban Dictionary
1. WarcraftLog Live Log finalizer.
1. Welcomer

## Build Requirements

Make a copy of the `.env.sample` file to `.env` and populate the following fields:
1. `guildId` - use this for quick development, to instantly access the changes.
1. `MONGO_URI` - mongodb connection string.

## Install dependencies

```
npm install -g typescript ts-node ts-node-dev
npm install
```

## Run dev environment

During development use
```
npm run start:dev
```
to instantly hot reload the app.


## Plugin deps

1. [Darkest dungeon soundboard](https://mega.nz/file/6IgDjbII#-L6pL18SDHOHN-wcb8gCmLReIox69xiT6Y6NDoTW8VA) under `/data/darkest/voice-data/*.ogg`

1. [Overwatch soundboard](https://mega.nz/file/KUh0XCSA#5qxDHW5DwwBficSaiXllsGmsYGjt82HgyYzeZvcj6rc) under `/data/overwatch/voice-data/*.ogg`
