import { Permission } from "../constants";
import DiscordGuild from "./guild";

export default class DiscordRole {
    public id: string;
    public name: string;
    public colour: number;
    public hoist: boolean;
    public position: number;
    public permissions: number;
    public mentionable: boolean;
    public guild: DiscordGuild;

    constructor(d: any, guild: DiscordGuild) {
        this.id = d.id;
        this.name = d.name;
        this.colour = d.color;
        this.hoist = d.hoist;
        this.position = d.position;
        this.permissions = parseInt(d.permissions);
        this.mentionable = d.mentionable;
        this.guild = guild;
    }

    public has(p: Permission): boolean {
        return (this.permissions & p) === 1;
    }
}