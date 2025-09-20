// test_query.js - testing gamedig lib queries for debugging

const { GameDig } = require('gamedig');
require('dotenv').config();

const SERVER_IP = process.env.ark_server_ip;
const SERVER_PORT = process.env.ark_server_port;
const SERVER_IP2 = process.env.ark_server_ip2;
const SERVER_PORT2 = process.env.ark_server_port2;

console.log(`--- Gamedig Test ---`)
console.log(`Attempting to query ASA server at ${SERVER_IP}:${SERVER_PORT}`);
console.log(`Please wait, this may take up to 20 seconds to time out...`);

GameDig.query({
    type: 'asa',
    host: SERVER_IP,
    port: SERVER_PORT,
    attemptTimeout: 100000
}).then(state => {
    console.log("\nSUCCESS! Server responded.");
    console.log("Server Name:", state.name);
    console.log("Players:", `${state.players.length}/${state.maxplayers}`);
    console.log("Map:", state.map);
    console.log(state)
    const srv1 = 1
}).catch(error => {
    console.error("\nFAILED! The query timed out or an error occured.");
    console.error("Error details:", error);
});

GameDig.query({
    type: 'asa',
    host: SERVER_IP2,
    port: SERVER_PORT2,
    attemptTimeout: 100000
}).then(state => {
    console.log("\nSUCCESS! Server responded.");
    console.log("Server Name:", state.name);
    console.log("Players:", `${state.players.length}/${state.maxplayers}`);
    console.log("Map:", state.map);
    console.log(state)
    const srv2 = 1
}).catch(error => {
    console.error("\nFAILED! The query timed out or an error occured.");
    console.error("Error details:", error);
});