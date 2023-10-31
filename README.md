# moshe 2.0
this is a discord music bot i created for fun. 

## required files:
in order to run the bot you will need the folllowing files files:
### 1. src/config.json:
configuration of the bot
    debug: bool - to determine if to run in debug mode
    creds.token: string - token for the discord bot
    creds.youtube_api_key: string - api key for fetching data from youtube data api
format:
```json
    {
        "debug": false,
        "creds": {
            "token": "",
            "youtube_api_key": ""
        }
    }
```

### 2. src/bot_data.json:
this file holds all the information the bot 
need to save in order to work.
format:
```json
    {
        "guilds_data": [
               
        ]
    }
```
## for running the bot

simply type 
```
    npm start
``` 
in terminal to start the bot
