import { NoSubscriberBehavior } from "@discordjs/voice";
import { Message } from "discord.js";
import { Player } from "../Player/Player";
import { BotData } from "../BotData";
import { commands } from "../commands/commands";

import { skip_help } from "../commands/skip";
import { play_help } from "../commands/play";
import { resume_help } from "../commands/resume";
import { pause_help } from "../commands/pause";
import { queue_help } from "../commands/queue";
import { kick_help } from "../commands/kick";
import { loop_help } from "../commands/loop";
import { clear_help } from "../commands/clear";
import { prefix_help } from '../commands/prefix';
import { word_help } from "../commands/word";
import { source_help } from "../commands/source";
import { info_help } from "../commands/info";
import { skipv_help } from "../commands/skipv";

export class Session {

    public readonly player: Player
    public readonly guildId: string
    public readonly guild_data: any
    protected help_message: string

    constructor(guildId: string) {
        this.player = new Player({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
            }
        });

        this.guildId = guildId;
        this.guild_data = BotData.instance.get_guild_data(guildId);
        this.help_message = "";
        this.build_help_message();
    }
    
    public save() {
        BotData.instance.save_guild_data(this);
        this.build_help_message();
    }

    protected build_help_message() {
        const bot_prefix = this.guild_data['bot_prefix'];
        const help_messages = [skip_help, play_help, resume_help, pause_help, queue_help,
            kick_help, loop_help, clear_help, prefix_help, word_help,
            source_help, info_help, skipv_help];    
        this.help_message = "";
        help_messages.map(message => bot_prefix + message + '\n').forEach(m => this.help_message += m);
    }
    /**
     * proccess the message, can be overridden to
     * create a custom server session.
     * when overriding this message, it should be called
     * at the bottom.
     * @param message the message to proccess
     */
    public async process_message(message: Message) {
        const content: string = message.content;
            
        if (content.startsWith(this.guild_data['bot_prefix'])) {
            let [command_name, ...args] = content.substring(1).split(" ");
            if (command_name == "help") {
                message.reply(this.help_message);
            }
            else if (commands.has(command_name)) {
                const command = commands.get(command_name)!;
                const reply_msg: string | undefined =  await command(this, message, args.join(' '));
                if (reply_msg) {
                    message.reply(reply_msg);
                }
            }
        }
    }
};