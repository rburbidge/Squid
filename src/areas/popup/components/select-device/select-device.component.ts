import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ChromeService } from '../../services/chrome.service';
import { ChromeAuthHelper } from '../../../common/chrome-auth-helper';
import { ChromeDeviceModel } from '../../services/squid-converter';
import { Config } from '../../../../config/config';
import { DeviceModel, DeviceType, ErrorCode, ErrorModel } from '../../../../contracts/squid';
import { DeviceService } from '../../services/device.service';
import { Route } from '../../routing/route';
import { SettingsService } from '../../services/settings.service';
import { Strings } from '../../../../assets/strings/strings';
import { UrlHelper } from '../../../common/url-helper';

/**
 * The options page. Allows the user to manage their registered devices.
 */
@Component({
    selector: 'select-device',
    templateUrl: './select-device.html',
    styleUrls: ['./select-device.css']
})
export class SelectDeviceComponent implements OnInit {

    public readonly strings: Strings = new Strings();

    constructor(
        private readonly deviceService: DeviceService,
        private readonly router: Router,
        private readonly chromeService: ChromeService,
        private readonly settingsService: SettingsService)
    { }

    public isLoading: boolean = true;
    public error: string;
    public devices: ChromeDeviceModel[] = [];
    public message: string;

    /**
     * Sends a URL to a device.
     * @param device The device to send the URL to.
     */
    public sendUrl(device: ChromeDeviceModel): Promise<void> {
        return this.chromeService.getCurrentTabUrl()
            .then(url => this.deviceService.sendUrl(device.id, url));
    }

    /**
     * Sync both the selected device, and the other devices from the server.
     */
    public refreshDevices(): Promise<void> {
        this.isLoading = true;
        delete this.error;

        return this.deviceService.getDevices()
            .then(devices => {
                if(!devices || devices.length == 0) {
                    this.goToAddDeviceComponent();
                    return;
                }

                this.devices = devices;
                this.isLoading = false;
            })
            .catch((error: ErrorModel) => {
                if (error && error.code == ErrorCode.UserNotFound) {
                    this.goToAddDeviceComponent();
                } else {
                    this.onError(this.strings.devices.refreshError);
                }
                this.isLoading = false;
            });
    }

    /**
     * Navigates the the add device component.
     */
    private goToAddDeviceComponent() {
        // TODO Implement go to add device component
    }

    private onError(error: string): void {
        this.isLoading = false;
        this.error = error;
    }

    public ngOnInit(): Promise<void> {
        return this.refreshDevices();
    }
}