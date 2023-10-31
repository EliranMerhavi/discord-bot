import { Message, Client, GatewayIntentBits, VoiceState } from "discord.js";
import { sessions } from "./globals";
import { Player } from "./Player/Player";
import { Session } from "./Session/Session";


import config from './config.json';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent
	]
});

const verbose_debug: boolean = false;

if (verbose_debug) {
	client.on('debug', console.log);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('messageCreate', async (message: Message) => {
	
	if ((message.author.id == client.user!.id) || (config.dictatorship && message.author!.id !== '439383103681593345'))
		return;

	const session: Session = sessions.get_session(message.guild!.id);
	session.process_message(message);
});

client.on('voiceStateUpdate', (oldState: VoiceState, newState: VoiceState) => {
	if (oldState.channelId && !newState.channelId && newState.id === client.user!.id // someone disconnected the bot
		|| (oldState.channelId === oldState.guild?.members.me?.voice.channelId && !newState.channel) && !(oldState.channel?.members.size! - 1) // only the bot is in the voice channel
	) {
		const player: Player = sessions.get_session(oldState.guild.id).player;
		player.kick();
	}
});

client.login(config['creds']['token']);