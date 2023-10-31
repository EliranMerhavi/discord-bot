import { Message } from "discord.js";
import { Session } from "../Session/Session";
import { BotData } from "../BotData";


const prefix = async (session: Session, message: Message, args: string) => {
    
    if (args.length != 1) {
        return `prefix must be 1 symbol, got ${args.length} symbols instead.`;
    }

    session.guild_data['bot_prefix'] = args;
    session.save();
    return `saved ${session.guild_data['bot_prefix']} as prefix.`;
}

const prefix_help: string = "prefix the change the bot prefix";

export {prefix, prefix_help}