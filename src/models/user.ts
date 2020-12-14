export default class DiscordUser {
    public username: string;
    public discriminator: string;
    public id: string;
    public bot: boolean;
    public avatar: null;
    public verified: boolean;
    public mfaEnabled: boolean;

    constructor(u: any) {
        this.username = u.username;
        this.discriminator = u.discriminator;
        this.verified = u.verified ?? false;
        this.avatar = u.avatar;
        this.mfaEnabled = u.mfa_enabled ?? false;
        this.id = u.id;
        this.bot = u.bot ?? false;
    }
}