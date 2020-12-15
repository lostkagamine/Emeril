import { EmerilClient } from "../client";
import DiscordGuild from "./guild";
import DiscordTextableChannel from "./textable";
import DiscordUser from "./user";
import DiscordRole from "./role";

export default class DiscordMember extends DiscordUser {
    public guild: DiscordGuild;
    public client: EmerilClient;
    public roles: DiscordRole[];
    public nick?: string;

    constructor(d: any, guild: any, client: EmerilClient, data: any) {
        super(d);
        this.guild = guild;
        this.client = client;
        this.roles = data.roles.map((e: any) => guild.roles.get(e));
        this.nick = data.nick;
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

    private async _updateRoles() {
        await this.client.callAPI(`guilds/${this.guild.id}/members/${this.id}`, 'patch', {
            roles: this.roles.map(e => e.id)
        });

        this.guild.members.update(this);
    }

    public async addRole(role: DiscordRole) {
        this.roles.push(role);
        await this._updateRoles();
    }

    public async removeRole(role: DiscordRole) {
        let ind = this.roles.indexOf(role);
        if (ind !== -1) {
            this.roles.splice(ind, 1);
            await this._updateRoles();
        }
    }
}