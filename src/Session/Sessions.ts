import { Session } from "./Session";


export class Sessions {

    private sessions: Map<string, Session>

    constructor() {
        this.sessions = new Map();
        // you can create custom sessions yourself and edit this section
        // start of adding custom sessions
        // this.sessions.set(WeLoseLolSession.instance.guildId, WeLoseLolSession.instance);
        // this.sessions.set(OurSurvivalSession.instance.guildId, OurSurvivalSession.instance);
        // this.sessions.set(TestingBotServer.instance.guildId, TestingBotServer.instance);
        // end of adding custom sessions 
    }

    public get_session(guildId: string): Session {
        if (!this.sessions.has(guildId)) {
            this.sessions.set(guildId, new Session(guildId));
        }
        return this.sessions.get(guildId)!;
    }
}