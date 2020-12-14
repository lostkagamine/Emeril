import DiscordChannel from "./channel";

export default class DiscordTextableChannel extends DiscordChannel {
    public async createMessage(data: string | object) {
        return this.client.callAPI(`channels/${this.id}/messages`,
                                   'post',
                                   typeof(data) === 'string' ? {content: data} : data);
    }
}