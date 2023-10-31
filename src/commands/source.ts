import { Message } from "discord.js";
import { Session } from "../Session/Session";


const source = async (session: Session, message: Message, args: string) => {
    return "here you go: https://github.com/EliranMerhavi/discord-music-bot";
}

const source_help: string = "source to get the source code of the bot";

export {source, source_help};