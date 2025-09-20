ArkLink by xbennies
Version 1.1 (20/09/2025)

to setup ArkLink:

1. create a file in the root directory of the bot named .env

2. paste the following into .env (change the values ofc):

discord_token="DISCORDTOKENHERE"
discord_client_id="CLIENTIDHERE"
ark_server_ip="SERVERIP"
ark_server_port="SERVERPORT"

TIPS:

for the discord values, head to https://discord.com/developers/applications and create a new application
in your new app, you can find the client id by copying the application ID located in General Information

the token is located in the Bot tab, you'll need to reset the token in order to obtain it, make sure you keep said token safe whilst still remembering it.

ROADMAP:
- make embeds look nicer
- implement a link into the embed to connect to the server
- hopefully transfer codebase into python once gamedig's python lib actually works
- add more commands
- implement RCON support