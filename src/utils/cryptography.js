import { AES, enc } from "crypto-js";

export function Encrypt(data) {
    return AES.encrypt(data, "exacheer").toString()
}

export function Decrypt(data) {
    return AES.decrypt(data, "exacheer").toString(enc.Utf8)
}