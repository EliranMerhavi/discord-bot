import { Message } from "discord.js";
import { Session } from "../Session/Session";
import { info } from "./info";


const skip = async (session: Session, message: Message, args: string) => {
    const player = session.player;
    player.skip_resource();

    return await info(session, message, args);
}

const skip_help: string = "skip to skip the current resource";

export {skip, skip_help};