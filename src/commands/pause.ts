
import { Message } from "discord.js";
import { Session } from "../Session/Session";


const pause = async (session: Session, message: Message, args: string) => {
    session.player.pause();
    return "pausing...";
}

const pause_help: string = "pause to pause the current song";

export {pause, pause_help}