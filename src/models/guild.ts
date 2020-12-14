import { EmerilClient } from "..";
import DiscordChannel from "./channel";
import DiscordMember from "./member";
import DiscordRole from "./role";

export default class DiscordGuild {
    public id: string;
    public name: string;
    public icon: string;
    public roles: DiscordRole[];
    public channels: DiscordChannel[];
    public members: DiscordMember[];
    public client: EmerilClient;

    public available: boolean;

    constructor(d: any, client?: EmerilClient) {
        this.id = d.id;
        this.name = d.name;
        this.icon = d.icon;
        if (client) {
            this.roles = d.roles.map((e:any) => new DiscordRole(e, this));
            this.channels = d.channels.map((e:any) => new DiscordChannel(e, client, this));
            this.members = d.members.map((e:any) => new DiscordMember(e.user, this, client));
            this.client = client;
        } else {
            this.roles = [];
            this.channels = [];
            this.members = [];
            this.client = null;
        }
    }

    public static createUnavailableGuild(id: number) {
        let g = new DiscordGuild({
            id,
            name: null,
            icon: null,
            roles: [],
            channels: [],
            members: []
        });
        g.available = false;
        return g;
    }

    public async getMember(id: string) {
        try {
            let h = this.members.find(e => e.id === id);
            if (h) {
               return h; 
            }

            let api = await this.client.callAPI(`guilds/${this.id}/members/${id}`, 'get');
            let m = new DiscordMember(api.data.user, this, this.client);
            this.members.push(m);
            return m;
        } catch(e) {
            // TODO: make this do something useful
            return null;
        }
    }
}