import { AxiosError } from "axios";
import { EmerilClient } from "./client";

export class EmerilException extends Error {};
export class MissingPermissions extends Error {};

export function handleAPIError(e: Error, c: EmerilClient) {
    let err = e as AxiosError;
    let res = err.response;
    let data = res.data;
    let error;

    switch (data.code) {
        case 50007:
        case 50013:
            error = new MissingPermissions(data.message);
        default:
            error = new EmerilException(data.message);
    }
    
    c.emit('error', error);

    return error;
}