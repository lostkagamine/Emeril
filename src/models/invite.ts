import DiscordChannel from "./channel";
import DiscordGuild from "./guild";

export default class DiscordInvite {
    public code: string;
    public guild: DiscordGuild;
    public channel: DiscordChannel;

    constructor(d: any, guild: DiscordGuild, channel: DiscordChannel) {
        this.code = d.code;
        this.guild = guild;
        this.channel = channel;
    }
}