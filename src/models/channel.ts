import axios from "axios";
import { EmerilClient, EmerilException } from "..";
import { apiCall, DiscordChannelType } from "../constants";
import DiscordGuild from "./guild";

export default class DiscordChannel {
    public id: string;
    public type: DiscordChannelType;
    public guild?: DiscordGuild;
    public name: string;
    public client: EmerilClient;

    public _d: any;

    constructor(d: any, client: EmerilClient, guild?: DiscordGuild) {
        this.id = d.id;
        this.type = d.type as DiscordChannelType;
        this.guild = guild;
        this.name = d.name;
        this._d = d;
        this.client = client;
    }

    public asTextable(): any {
        let textable = (this.type === DiscordChannelType.GUILD_TEXT) ||
                       (this.type === DiscordChannelType.DM) ||
                       (this.type === DiscordChannelType.GROUP_DM);
        if (!textable) {
            throw new EmerilException('Channel is not textable.');
        }

        // I'm sorry, typescript has forced my hand
        return new (require('./textable').default)(this._d, this.client, this.guild);
    }
}