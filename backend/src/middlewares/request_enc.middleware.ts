
import * as CryptoJS from 'crypto-js';
import { NextFunction, Request, Response } from 'express';


function requestDecrypt(request: Request, response: Response, next: NextFunction) {
    console.log('\n encryption req url: ', request.url);
    if (process.env.ENCRYPTION_ENABLED === 'yes') {
        try {
            let dataFields = reqDeEncrypt(request.body.data);
            dataFields = JSON.parse(dataFields);
            console.log('\n -------- decrypted data: ', dataFields);
            request.body = dataFields;
            next();
        } catch (error) {
            console.log('error of enc is ', error);
            return response.status(500).json(error);
        }
    } else {
        next();
    }
}
function reqDeEncrypt(text: any) {
    const reqEncKey: any = process.env.ENCDECRYPTKEY;
    console.log(`"${reqEncKey}"`, 'test');
    const bytes = CryptoJS.AES.decrypt(text, reqEncKey);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
}

export default requestDecrypt;
