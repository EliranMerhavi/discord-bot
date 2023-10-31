import { Message } from "discord.js";
import { Session } from "../Session/Session";


const loop = async (session: Session, message: Message, args: string) => {
    const player = session.player;
    player.loop = !player.loop;
    return `loop set to ${player.loop}`;
}

const loop_help: string = "loop to activate/disable loop";

export {loop, loop_help}