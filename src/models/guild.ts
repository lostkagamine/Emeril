import { EmerilClient } from "..";
import Collection from "../collection";
import DiscordChannel from "./channel";
import DiscordMember from "./member";
import DiscordRole from "./role";

export default class DiscordGuild {
    public id: string;
    public name: string;
    public icon: string;
    public roles: Collection<DiscordRole>;
    public channels: Collection<DiscordChannel>;
    public members: Collection<DiscordMember>;
    public client: EmerilClient;

    public available: boolean;

    constructor(d: any, client?: EmerilClient) {
        this.id = d.id;
        this.name = d.name;
        this.icon = d.icon;
        this.roles = new Collection<DiscordRole>();
        this.channels = new Collection<DiscordChannel>();
        this.members = new Collection<DiscordMember>();
        this.client = client ?? null;

        if (client) {
            for (let e of d.roles) {
                this.roles.add(new DiscordRole(e, this));
            }
            for (let e of d.channels) {
                this.channels.add(new DiscordChannel(e, client, this));
            }
            for (let e of d.members) {
                this.members.add(new DiscordMember(e, this, client));
            }
            this.client = client;
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
            let cache = this.members.get(id);
            if (cache) return cache;

            let api = await this.client.callAPI(`guilds/${this.id}/members/${id}`, 'get');
            let m = new DiscordMember(api.data.user, this, this.client);
            this.members.update(m);
            return m;
        } catch(e) {
            // TODO: make this do something useful
            return null;
        }
    }
}