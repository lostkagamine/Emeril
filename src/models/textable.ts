import { AxiosError } from "axios";
import { EmerilClient, EmerilException } from "..";
import Collection from "../collection";
import { handleAPIError, MissingPermissions } from "../misc";
import DiscordChannel from "./channel";
import DiscordGuild from "./guild";
import DiscordMessage from "./message";

export default class DiscordTextableChannel extends DiscordChannel {
    public messages: Collection<DiscordMessage>;

    constructor(d: any, client: EmerilClient, guild?: DiscordGuild) {
        super(d, client, guild);
        this.messages = new Collection<DiscordMessage>();
    }

    public async createMessage(data: string | object, quote?: DiscordMessage): Promise<DiscordMessage> {
        let toSend: any = typeof(data) === 'string' ? {content: data} : data;
        if (quote) {
            toSend.message_reference = {
                channel_id: this.id,
                message_id: quote.id
            };
        }
        
        try {
            let h: any = await this.client.callAPI(`channels/${this.id}/messages`, 'post', toSend);
            let msg = new DiscordMessage(h.data, this, this.client);
            return msg;
        } catch(e) {
            return Promise.reject(handleAPIError(e, this.client));
        }
    }

    public async getMessage(id: string): Promise<DiscordMessage> {
        let cache = this.messages.get(id);
        if (cache) {
            return cache;
        }

        try {
            let api: any = await this.client.callAPI(`channels/${this.id}/messages/${id}`, 'get', null);
            let msg = new DiscordMessage(api.data, this, this.client);
            this.messages.update(msg);
            return msg;
        } catch(e) {
            return Promise.reject(handleAPIError(e, this.client));
        }
    }

    public async startTyping() {
        try {
            await this.client.callAPI(`channels/${this.id}/typing`, 'post', {});
        } catch(e) {
            return Promise.reject(handleAPIError(e, this.client));
        }
    }
}