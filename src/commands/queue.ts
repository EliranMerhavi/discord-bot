import { Message } from "discord.js";
import { Session } from "../Session/Session";


const queue = async (session: Session, message: Message, args: string) => {

    const player = session.player;

    if (!player.resource_queue.length) {
        return "empty";
    }

    let info = '';

    for (let i = 0; i < Math.min(player.resource_queue.length, 5); i++) {
        info += (i + 1) + ': ' + player.resource_queue[i].info + '\n';
    }

    if (player.resource_queue.length > 5) {
        info += "...\n";
    }

    return info;
};

const queue_help: string = "queue to print the resource queue";

export {queue, queue_help};