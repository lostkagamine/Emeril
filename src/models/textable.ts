import { AxiosError } from "axios";
import { EmerilException } from "..";
import { handleAPIError, MissingPermissions } from "../misc";
import DiscordChannel from "./channel";

export default class DiscordTextableChannel extends DiscordChannel {
    public async createMessage(data: string | object) {
        return this.client.callAPI(`channels/${this.id}/messages`,
                                       'post',
                                       typeof(data) === 'string' ? {content: data} : data)
                .catch(e => {
                    handleAPIError(e);
                });
    }
}