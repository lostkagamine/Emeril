import { EmerilClient } from "../client";
import { handleAPIError } from "../misc";
import DiscordGuild from "./guild";
import DiscordMember from "./member";
import DiscordTextableChannel from "./textable";
import DiscordUser from "./user";
import DiscordWebhook from "./webhook";

export default class DiscordMessage {
    public id: string;
    public channel?: DiscordTextableChannel;
    public content: string;
    public author: DiscordUser | DiscordWebhook;
    public safeAuthor?: DiscordUser;
    public member?: DiscordMember;
    public guild?: DiscordGuild;
    public client: EmerilClient;

    constructor(d: any, channel: DiscordTextableChannel = null, client: EmerilClient) {
        if (d.webhook_id) {
            this.author = new DiscordWebhook(d.author);
        } else {
            let h: DiscordUser = new DiscordUser(d.author);
            this.author = h;
            this.safeAuthor = h;
            if (channel && channel.guild) {
                let m = channel.guild.members.get(d.author.id);
                if (m) {
                    this.member = m;
                } else {
                    if (d.author.id === client.me.id) {
                        // it's the bot
                        // idk what to do here
                        if (channel.guild.botMember) {
                            this.member = channel.guild.botMember;
                        }
                    } else {
                        this.member = new DiscordMember(h._d, channel.guild, client, d.member);
                    }
                }
            }
        }

        this.id = d.id;
        this.content = d.content;
        this.channel = channel;
        this.guild = channel ? channel.guild : null;
        this.client = client;
    }

    public async delete() {
        try {
            await this.client.callAPI(`channels/${this.channel.id}/messages/${this.id}`, 'delete', null);
        } catch(e) {
            return Promise.reject(handleAPIError(e, this.client));
        }
    }
}