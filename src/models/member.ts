import { EmerilClient } from "../client";
import DiscordGuild from "./guild";
import DiscordTextableChannel from "./textable";
import DiscordUser from "./user";

export default class DiscordMember extends DiscordUser {
    public guild: DiscordGuild;
    public client: EmerilClient;

    constructor(d: any, guild: any, client: EmerilClient) {
        super(d);
        this.guild = guild;
        this.client = client;
    }

    public async dmChannel(): Promise<DiscordTextableChannel> {
        let api = await this.client.callAPI('users/@me/channels',
                                            'post',
                                            {recipient_id: this.id});
        let ch = new DiscordTextableChannel(api.data, this.client, null);
        return ch;
    }

    public async kick(): Promise<void> {
        await this.client.callAPI(`guilds/${this.guild.id}/members/${this.id}`, 'delete', {});
    }

    public async ban(deleteMessageDays: number = 0, reason?: string): Promise<void> {
        await this.client.callAPI(`guilds/${this.guild.id}/bans/${this.id}`, 'put', {
            delete_message_days: deleteMessageDays,
            reason: reason
        });
    }
}