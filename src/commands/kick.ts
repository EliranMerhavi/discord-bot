import { Message } from "discord.js";
import { Session } from "../Session/Session";


const kick = async (session: Session, message: Message, args: string) => {
    session.player.kick();
    return "REEEEEEEEEEEEEEEEE";
}

const kick_help: string = "kick to kick his ass";

export {kick, kick_help}