import { Component } from '@angular/core';

import { ChromeService } from '../../../services/chrome.service';
import { Strings } from '../../../../../assets/strings/strings';

/**
 * Tells the user that they need to sign into Google Chrome to use the app, and shows a sign-in button.
 */
@Component({
    selector: 'signed-out',
    templateUrl: './signed-out.html',
    styleUrls: [ './signed-out.css' ]
})
export class SignedOutComponent {

    public readonly strings: Strings = new Strings();

    constructor(private readonly chromeService: ChromeService) { }

    /**
     * Sign the user in.
     * @returns true iff the user signs in.
     */
    public signIn(): Promise<boolean> {
        return this.chromeService.signIntoChrome();
    }
}