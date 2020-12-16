import { AxiosError } from "axios";
import { EmerilClient } from "./client";

export class RESTException extends Error {
    public code: number;

    public constructor(msg?: string, code?: number) {
        super(msg);
        this.code = code;
    }

    get name(): string {
        return `RESTException (${this.code})`;
    }
};

export class EmerilException extends Error {
    public name = "EmerilException";
}

export function handleAPIError(e: Error, c: EmerilClient) {
    let err = e as AxiosError;
    let res = err.response;
    let data = res.data;
    let the = new RESTException(data.message, data.code);
    
    c.emit('error', the);

    return the;
}