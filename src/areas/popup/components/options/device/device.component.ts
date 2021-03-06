import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';

import { Strings } from "../../../../../assets/strings/strings";
import { SquidService } from "../../../services/squid.service";
import { Config } from "../../../../../config/config";
import { NotificationsService } from "angular2-notifications";

/**
 * Shows options for a device.
 */
@Component({
    selector: 'device',
    templateUrl: './device.html',
    styleUrls: [ './device.css' ]
})
export class DeviceComponent implements OnInit {
    public readonly strings: Strings = new Strings();

    public deviceId: string;
    public deviceName: string;
    public deviceIcon: string;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly location: Location,
        private readonly squidService: SquidService,
        private readonly notifications: NotificationsService) { }

    public sendLink(): Promise<void> {
        return this.squidService.sendUrl(this.deviceId, Config.squidEndpoint + '/squid/test')
            .then(() => {
                this.notifications.info(null, this.strings.device.linkSent);
            })
            .catch(() => {
                this.notifications.error(null, this.strings.device.error.sendLink);
            });
    }

    public remove(): Promise<void> {
        if(window.confirm(this.strings.device.removeConfirm(this.deviceName))) {
            return this.squidService.removeDevice(this.deviceId)
                .then(() => this.location.back())
                .catch(() => {
                    this.notifications.error(null, this.strings.device.error.remove);
                });
        }

        return Promise.resolve();
    }

    public ngOnInit(): void {
        const params: any = this.route.snapshot.params;
        this.deviceId = params.deviceId;
        this.deviceName = params.deviceName;
        this.deviceIcon = params.deviceIcon;
    }
}