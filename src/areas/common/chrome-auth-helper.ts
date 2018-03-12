import { ErrorCode, ErrorModel } from "../../contracts/squid";
import { ChromeErrorModel } from "../popup/services/squid-converter";

export class ChromeAuthHelper {
    /**
     * Creates an Authorization header for the user signed-in to Google Chrome.
     * @param interactiveSignIn If true, prompts the user to sign in, which opens up the Chrome Browser sign-in page
     * and kills the current viewport. If false, throws an error.
     */
    public static createAuthHeader(interactiveSignIn: boolean = false): Promise<string> {
        return new Promise((resolve, reject) => {
            chrome.identity.getAuthToken({ 'interactive': interactiveSignIn }, (token) => {
                if (chrome.runtime.lastError) {
                    const errorMessage = chrome.runtime.lastError.message;
                    let error: ErrorCode;
                    if(errorMessage && errorMessage.indexOf('not signed in') !== -1) {
                        error = ErrorCode.NotSignedIn;
                    } else {
                        error = ErrorCode.Unknown;
                    }

                    reject(new ChromeErrorModel(error, errorMessage));
                    return;
                }

                // Header prefixes are one of the following:
                // 'Bearer Google OAuth Access Token='
                // 'Bearer Google OAuth ID Token='
                // See http://stackoverflow.com/questions/8311836/how-to-identify-a-google-oauth2-user/13016081#13016081
                // for details on access vs. ID tokens
                resolve(`Bearer Google OAuth Access Token=${token}`);
            });
        })
    }
}