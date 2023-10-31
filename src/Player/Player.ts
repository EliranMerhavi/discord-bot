import { AudioPlayer, AudioPlayerStatus, CreateAudioPlayerOptions, VoiceConnection, createAudioResource, joinVoiceChannel, DiscordGatewayAdapterCreator, VoiceConnectionStatus, PlayerSubscription } from "@discordjs/voice";
import { VoiceBasedChannel } from "discord.js";
import { exec as ytdlexec } from 'youtube-dl-exec';
import { debug } from '../config.json';
import { Resource } from "./Resource";


export type SongsQueue = Resource[];

export class Player extends AudioPlayer {
    channel: VoiceBasedChannel | null
    connection: VoiceConnection | null
    resource_queue: SongsQueue
    loop: boolean
    private skip_resource_flag: boolean

    constructor(options: CreateAudioPlayerOptions) {
        super(options);
        this.channel = null;
        this.connection = null;
        this.loop = false;
        this.resource_queue = [];
        this.skip_resource_flag = false;

        this.on(AudioPlayerStatus.Idle, async (oldState, newState) => {
            if (!this.resource_queue.length)
                return;
            
            if (this.skip_resource_flag || (!this.loop && this.resource_queue[0].finished())) {
                this.resource_queue.shift();
            } else if (!this.loop) {
                await this.resource_queue[0].update();
            }
            
            if (this.resource_queue.length)
                this.play_song(this.resource_queue[0].url_to_play);

            if (this.skip_resource_flag)
                this.skip_resource_flag = false;
        });

        if (debug) {
            this.on("stateChange", async (oldState, newState) => {
                console.log(`[AUDIO_PLAYER] switched from ${oldState.status} to ${newState.status}.`);
            });

            this.on('subscribe', (subscription: PlayerSubscription) => {
                console.log("subscribed");
            });

            this.on('unsubscribe', (subscription: PlayerSubscription) => {
                console.log("unsubscribed");
            });
        }

    }

    public connect_to_channel(channel: VoiceBasedChannel): void {
        this.connection?.destroy();

        this.channel = channel;

        this.connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
        });

        // for solving the disconnecting problem .ref: https://github.com/discordjs/discord.js/issues/9185#issuecomment-1459066343
        this.connection.on('stateChange', (oldState, newState) => {
            const oldNetworking = Reflect.get(oldState, 'networking');
            const newNetworking = Reflect.get(newState, 'networking');

            const networkStateChangeHandler = (oldNetworkState: any, newNetworkState: any) => {
                const newUdp = Reflect.get(newNetworkState, 'udp');
                clearInterval(newUdp?.keepAliveInterval);
            };

            oldNetworking?.off('stateChange', networkStateChangeHandler);
            newNetworking?.on('stateChange', networkStateChangeHandler);
            if (debug)
                console.log(`[CONNECTION] switched from ${oldState.status} to ${newState.status}.`);
        });

        this.connection?.on(VoiceConnectionStatus.Ready, () => {
            if (debug) {
                console.log('The connection has entered the Ready state - ready to play audio!');
            }
            this.connection?.subscribe(this);
        });

        this.connection?.on(VoiceConnectionStatus.Disconnected, () => {
            if (debug) {
                console.log('The connection has entered the Ready state - ready to play audio!');
            }
            this.connection?.subscribe(this);
        })

        if (debug) {
            this.connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
                console.log('Connection is in the Ready state!');
            });
        }
    }

    public skip_video() {
        this.stop(true);   
    }

    public kick(): void {
        this.connection?.destroy();
        this.connection = null;
        this.channel = null;
    }

    public skip_resource(): void {
        this.skip_resource_flag = true;
        this.stop(true);
    }

    public insert_to_start(resource: Resource): void {
        this.resource_queue.unshift(resource);
        this.play_song(resource.url_to_play);
    }

    public push_song(resource: Resource): void {
        if (!this.resource_queue.length)
            this.play_song(resource.url_to_play);
        this.resource_queue.push(resource);
    }

    public clear_queue(): void {
        this.resource_queue = [];
        this.skip_resource();
    }

    private play_song(url: string): void {
        const subprocess = ytdlexec(
            url,
            {
                output: '-',
                format: 'bestaudio',
                audioFormat: 'opus',
                limitRate: '1M',
                rmCacheDir: true
            },
            { stdio: ['ignore', 'pipe', 'ignore'] }
        );
        super.play(createAudioResource(subprocess.stdout!));
    }
}