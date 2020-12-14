export default class DiscordWebhook {
    public username: string;
    public id: string;
    public avatar: string;
    public bot: boolean = true;

    constructor(d: any) {
        this.username = d.username;
        this.id = d.id;
        this.avatar = d.avatar;
    }
}