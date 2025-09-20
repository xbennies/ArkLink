// bot.js - main bot script
// created by xbennies
// version 1 (19/09/2025)

// Import necessary libraries
const { Client, GatewayIntentBits, EmbedBuilder, Routes, REST, SlashCommandBuilder } = require('discord.js');
// future note: import gamedig EXACTLY as shown, only importing the class seems to work but importing the whole lib doesn't allow querying
const { GameDig } = require('gamedig');
require('dotenv').config();

// Import .env
const TOKEN = process.env.discord_token;
const CLIENT_ID = process.env.discord_client_id;
const SERVER_IP = process.env.ark_server_ip;
const SERVER_PORT = process.env.ark_server_port;
const SERVER_IP_2 = process.env.ark_server_ip2;
const SERVER_PORT_2 = process.env.ark_server_port2;

// Check environment variables are loaded correct
if (!TOKEN || !CLIENT_ID || !SERVER_IP || !SERVER_PORT) {
    console.error("FATAL ERROR: One or more required environment variables are missing. Please check/create your .env file in the root of the bot's folder.")
    process.exit(1)
}

// Create Discord client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Event handler when the bot is fully running
client.once('clientReady', () => {
    console.log(`STARTUP: Logged in as ${client.user.tag}`);
    console.log(`STARTUP: Bot is ready and listening for commands!`);
});

// Event handler for slash command interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'status') {
        await interaction.deferReply();

        const serverChoice = interaction.options.getString('server');

        let targetIp
        let targetPort;
        let serverFriendlyName;

        if (serverChoice === 'server1') {
            targetIp = SERVER_IP;
            targetPort = SERVER_PORT;
            serverFriendlyName = "Main Server";
        } else if (serverChoice === 'server2') {
            targetIp = SERVER_IP_2;
            targetPort = SERVER_PORT_2;
            serverFriendlyName = "Map Rotation Server";
        } else {
            return interaction.editReply('Invalid server choice.')
        }

        // for future note, query gamedig EXACTLY as shown, using .then(state) and then the usual .catch(error) straight after.
        GameDig.query({
            type: 'asa',
            host: targetIp,
            port: targetPort,
            attemptTimeout: 100000
        }).then(state => {
            console.log(`Query for ${serverFriendlyName} successful, building embed...`);

            const embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`✅ ${serverFriendlyName} Status: Online`)
                .setDescription(state.name)
                .addFields(
                    { name: '🗺️ Map', value: state.map, inline: true },
                    { name: '👥 Players', value: `${state.numplayers}/${state.maxplayers}`, inline: true },
                    { name: '🛜 Ping', value: `${state.ping}ms`, inline: true },
                )
                .setFooter({ text: `Data retrieved successfully for ${serverFriendlyName}.` })
                .setTimestamp();

            interaction.editReply({ embeds: [embed] });

            // lets hope this function doesnt run for the 1000th time, or i may break something expensive
        }).catch(error => {
            console.error(`ERROR: Query failed inside bot: ${error}`);

            const errorEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle(`❌ ${serverFriendlyName} Status: Offline`)
                .setDescription('Could not retrieve information from the server.\nIt might be offline, restarting, or unreachable.');

            interaction.editReply({ embeds: [errorEmbed] });
        });
    }
});

// --- Command Registration ---
// update our commands with discord, should work on every startup
const commands = [
    new SlashCommandBuilder()
        .setName('status')
        .setDescription('Get the current status of both Ark servers.')
        .addStringOption(option =>
            option.setName('server')
                .setDescription('The server you wish to check the status of.')
                .setRequired(true)
                .addChoices(
                    { name: 'Main Server', value: 'server1' },
                    { name: 'Map Rotation Server', value: 'server2' }
                )
        )
        .toJSON(), // discords api always works better with JSON
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log('REGISTRATION: Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );
        console.log('REGISTRATION: Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

// Login to Discord with client token
client.login(TOKEN);