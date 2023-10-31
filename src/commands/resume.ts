import { Message } from "discord.js";
import { Session } from "../Session/Session";


const resume = async (session: Session, message: Message, args: string) => {
    session.player.unpause();
	return "unpausing...";
}

const resume_help: string = "resume to resume the current song";

export {resume, resume_help};