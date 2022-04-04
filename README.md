# pepe-bot13

## Requirements

Make a copy of the `.env.sample` file to `.env` and populate the following fields:
1. `guildId` - use this for quick development, to instantly access the changes.
1. `MONGO_URI` - mongodb connection string.

## Install dependencies

```
npm install -g typescript
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
