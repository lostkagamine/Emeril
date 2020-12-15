import { AxiosError } from "axios";

export class EmerilException extends Error {};
export class MissingPermissions extends Error {};

export function handleAPIError(e: Error) {
    let err = e as AxiosError;
    let res = err.response;
    let data = res.data;
    
    switch (data.code) {
        case 50007:
            throw new MissingPermissions(data.message);
        default:
            throw new EmerilException(data.message);
    }
}