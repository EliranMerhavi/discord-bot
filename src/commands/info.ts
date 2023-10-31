import { Message } from "discord.js";
import { Session } from "../Session/Session";


const info = async (session: Session, message: Message, args: string) => {
    if (!session.player.resource_queue.length)
        return "queue is empty";
    return session.player.resource_queue[0].info;
};

const info_help: string = "info to get the info on the current playing resource";

export {info, info_help}