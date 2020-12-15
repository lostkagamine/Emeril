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

    /**
     * Checks if the role has a certain permission.
     * @param p A value from the Permission enum.
     */
    public has(p: Permission): boolean {
        return (this.permissions & p) === 1;
    }

    /**
     * Checks if the role can perform a certain action.
     * Takes ADMINISTRATOR into account.
     * @param p A value from the Permission enum.
     */
    public can(p: Permission): boolean {
        return this.has(p) || this.has(Permission.ADMINISTRATOR);
    }
}