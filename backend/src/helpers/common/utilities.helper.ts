import * as jwt from "jsonwebtoken";
import * as bcrypt from 'bcrypt';
// import AWS from "aws-sdk";
import Hogan from "hogan.js";
import path from "path";
import fs from "fs";
// import { Client, Status, GeocodeResponse } from "@googlemaps/google-maps-services-js";

const THREE_WEEKS = 60 * 60 * 24 * 7 * 3;

class UtilitiesHelper {
    constructor() { }
    //generate jwt
    public generateJwt(jwtData: object) {
        const secret: any = process.env.JWTSECRET;
        return new Promise((resolve, reject) => {
            try {
                const JWT = jwt.sign(jwtData, secret, {
                    expiresIn: THREE_WEEKS,
                });
                resolve(JWT);
            } catch (error) {
                console.log('error', error);
                reject(error);
            }
        });
    }
    //generate random string
    public randomString(length: number): string {
        let result = '';
        const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i += 1) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    //generate hash for password
    public generateHash(password: any) {
        const saltRounds = 10;
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, saltRounds).then((hash: any) => {
                // Store hash in your password DB.
                resolve(hash);
            }).catch((error: any) => reject(error));
        });
    }
    //compare password hash
    public compareHash(passwordtext: any, hash: any) {
        const saltRounds = 10;
        return new Promise((resolve, reject) => {
            // Load hash from your password DB.
            bcrypt.compare(passwordtext, hash).then((result) => {
                // result == true
                resolve(true);
            }).catch((error: any) => reject(false));
        });
    }
    //check for valid password
    public isValidPassword(password: string) {
        password = String(password);
        const length = password.length;
        const passUpper: string = password.toUpperCase();
        const passLower: string = password.toLowerCase();
        if (length > 7 && passUpper !== password && password !== passLower) {
            return true;
        } else {
            return false;
        }
    }
    //send Email using AWS SES
    // sendEmail(data: any) {
    //     const { email, subject, template, templateData } = data;
    //     // var body = fs.readFile("./EmailTemplate.html");
    //     const accessKeyId = process.env.EMAIL_ACCESS_KEY;
    //     const secretAccessKey = process.env.EMAIL_SECRET_ACCESS_KEY;

    //     let body: any = fs.readFileSync(
    //         // path.resolve(__dirname, "../templates/registration.html"),
    //         path.resolve(__dirname, `../../templates/${template}`),
    //         "utf8"
    //     );
    //     body = Hogan.compile(body, {
    //         delimiters: "<% %>"
    //     });
    //     body = body.render(templateData);
    //     // emailUtils.sendEmail(email, "Welcome to VeganNation!", body);

    //     AWS.config.update({
    //         accessKeyId,
    //         secretAccessKey,
    //         region: "us-east-1"
    //     });

    //     const ses = new AWS.SES();

    //     const params = {
    //         Destination: {
    //             CcAddresses: [],
    //             ToAddresses: [email]
    //         },
    //         Message: {
    //             Body: {
    //                 Html: {
    //                     Charset: "UTF-8",
    //                     Data: body
    //                 }
    //             },
    //             Subject: {
    //                 Charset: "UTF-8",
    //                 Data: subject
    //             }
    //         },
    //         Source: "VeganNation <info@vegannation.io>",
    //         ReplyToAddresses: ["info@vegannation.io"]
    //     };

    //     ses.sendEmail(params, (err: any, data: any) => {
    //         // If something goes wrong, print an error message.
    //         if (err) {
    //             console.log(err.message);
    //         } else {
    //             console.log("Email sent! Message ID: ", data.MessageId);
    //         }
    //     });
    // }

}

export default new UtilitiesHelper();