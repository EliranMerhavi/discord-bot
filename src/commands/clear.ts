import { Message } from "discord.js";
import { Session } from "../Session/Session";


const clear = async (session: Session, message: Message, args: string) => {
    session.player.clear_queue();
    return "queue is cleared!";
}

const clear_help : string = "clear to clear the queue";

export {clear, clear_help }