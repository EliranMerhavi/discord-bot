import { skip } from "./skip";
import { play } from "./play";
import { resume } from "./resume";
import { pause } from "./pause";
import { queue } from "./queue";
import { kick } from "./kick";
import { loop } from "./loop";
import { clear } from "./clear";
import { prefix } from './prefix';
import { word } from "./word";
import { source } from "./source";
import { info } from "./info";
import { skipv } from "./skipv";


import { Session } from "../Session/Session";
import { Message } from "discord.js";

export type Command = (session: Session, message: Message<boolean>, keywords: string) => Promise<string>;

export const commands: Map<string, Command> = new Map([
    ['play', play],
    ['skip', skip],
    ['resume', resume],
    ['pause', pause],
    ['queue', queue],
    ['kick', kick],
    ['loop', loop],
    ['clear', clear],
    ['prefix', prefix],
    ['word', word], 
    ['source', source],
    ['info', info],
    ['skipv', skipv],
]);

