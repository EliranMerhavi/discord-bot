import { Message } from "discord.js";
import { Session } from "../Session/Session";
import { info } from "./info";



const skipv = async (session: Session, message: Message, args: string) => {
    session.player.skip_video();
    return await info(session, message, args);
}

const skipv_help: string = "skipv to skip one video";

export {skipv, skipv_help};