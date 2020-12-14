import { EmerilClient } from "../client";
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

    constructor(d: any, channel: DiscordTextableChannel = null, client: EmerilClient) {
        if (d.webhook_id) {
            this.author = new DiscordWebhook(d.author);
        } else {
            let h: DiscordUser = new DiscordUser(d.author);
            this.author = h;
            this.safeAuthor = h;
        }

        if (channel && channel.guild) {
            this.member = new DiscordMember(d.author, channel.guild, client);
        }
        this.id = d.id;
        this.content = d.content;
        this.channel = channel;
        this.guild = channel ? channel.guild : null;
    }
}