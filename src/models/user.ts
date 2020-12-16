export default class DiscordUser {
    public username: string;
    public discriminator: string;
    public id: string;
    public bot: boolean;
    public avatar: null;
    public verified: boolean;
    public mfaEnabled: boolean;

    public _d: any;

    constructor(u: any) {
        this._d = u;
        this.username = u.username;
        this.discriminator = u.discriminator;
        this.verified = u.verified ?? false;
        this.avatar = u.avatar;
        this.mfaEnabled = u.mfa_enabled ?? false;
        this.id = u.id;
        this.bot = u.bot ?? false;
    }
}