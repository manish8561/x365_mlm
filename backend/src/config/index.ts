import { config } from 'dotenv';
import { resolve as Resolve } from 'path';
export function initiate() {
    return new Promise((resolve) => {
        if (process.env.NODE_ENV === 'prod') {
            console.log('::YOU ARE ON PRODUCTION MODE::');
            config({ path: Resolve(__dirname, './prod.env') });
        } else if (process.env.NODE_ENV === 'stage') {
            console.log('::YOU ARE ON STAGING MODE::');
            config({ path: Resolve(__dirname, './stage.env') });
        } else if (process.env.NODE_ENV === 'dev') {
            console.log('::YOU ARE ON DEV MODE::');
            config({ path: Resolve(__dirname, './dev.env') });
        } else if (process.env.NODE_ENV === 'qa') {
            console.log('::YOU ARE ON QA MODE::');
            config({ path: Resolve(__dirname, './qa.env') });
        } else {
            console.log('::YOU ARE ON local MODE::');
            config({ path: Resolve(__dirname, './local.env') });
        }
        resolve(true);
    });
}
