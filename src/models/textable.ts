import { AxiosError } from "axios";
import { EmerilException } from "..";
import { MissingPermissions } from "../misc";
import DiscordChannel from "./channel";

export default class DiscordTextableChannel extends DiscordChannel {
    public async createMessage(data: string | object) {
        return this.client.callAPI(`channels/${this.id}/messages`,
                                       'post',
                                       typeof(data) === 'string' ? {content: data} : data)
                .catch(e => {
                    let err = e as AxiosError;
                    let res = err.response;
                    let data = res.data;
                    
                    switch (data.code) {
                        case 50007:
                            throw new MissingPermissions(data.message);
                        default:
                            throw new EmerilException(data.message);
                    }
                });
    }
}