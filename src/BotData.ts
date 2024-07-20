import fs from "fs";
import bot_data from "./bot_data.json";
import { Session } from "./Session/Session";

export class BotData {

    private static _instance: BotData
    private guilds_data: Map<string, object>

    constructor() {
        this.guilds_data = new Map();
        console.log(bot_data['guilds_data']);
    }

    get_guild_data(guildId: string): any {
        if (!this.guilds_data.has(guildId)) {
            this.guilds_data.set(guildId, {
                "bot_prefix": "%"
            });
            this.save();
        }
        return this.guilds_data.get(guildId);
    }

    save_guild_data(session: Session): void {
        this.guilds_data.set(session.guildId, session.guild_data);
        this.save();
    }

    save(): void {
        bot_data['guilds_data'] = Array.from(this.guilds_data.entries());
        fs.writeFileSync('./src/bot_data.json', JSON.stringify(bot_data, null, 4));
    }

    public static get instance(): BotData {
        if (!BotData._instance)
            BotData._instance = new BotData();

        return BotData._instance;
    }
}