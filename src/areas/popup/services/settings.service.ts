import { Injectable } from '@angular/core';

import { DeviceModel } from '../../../contracts/squid';
import { ChromeDeviceModel, convertDeviceModel } from './squid-converter';

/**
 * The app settings.
 */
export interface Settings {
    /** The user's current set of devices, including this device. Defined when the user has loaded their devices before. */
    devices?: ChromeDeviceModel[];

    /** This device's information. Defined when the user has registered this device. */
    thisDevice?: {
        gcmToken: string;
        id: string;
    };
}

/**
 * Abstraction for settings, stored in chrome.storage.sync.
 * 
 * To use SettingsService, create an instance and call init(). Settings can then be retrieved synchronously from the 'settings'
 * field. This field will be updated whenever settings are updated.
 * 
 * @see https://developer.chrome.com/apps/storage
 */
@Injectable()
export class SettingsService {
    
    /**
     * The settings. Use after init() is called.
     */
    public settings: Settings = SettingsService.createDefault();

    /**
     * Creates the default settings. Used by production and test code.
     */
    public static createDefault(): Settings {
        // NOTE: All object-type fields should be null, not undefined. This is used to retrieve settings from Chrome
        // Storage. If a field is undefined, then it will not be retrieved.
        return {
            devices: null,
            thisDevice: null
        }
    };

    /**
     * Initialize the SettingsService. Called once on app startup, after which settings will be defined.
     */
    public init(): Promise<void> {
        let start = new Date().getTime();
        return new Promise<void>((resolve, reject) => {
            chrome.storage.sync.get(
                SettingsService.createDefault(),
                (settings: Settings) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    }

                    settings.devices = settings.devices && settings.devices.map(convertDeviceModel);
                    Object.assign(this.settings, settings);
                    console.log(new Date().getTime() - start);
                    resolve();
                });
        });
    }

    /**
     * Sets the cached devices.
     * @param devices The new set of cached devices.
     */
    public setDevices(devices: ChromeDeviceModel[]): Promise<void> {
        return this.set({ devices: devices });
    }

    /**
     * Set the current device information.
     */
    public setThisDevice(deviceId: string, gcmToken: string): Promise<void> {
        return this.set({
            thisDevice: {
                id: deviceId,
                gcmToken: gcmToken
            }
        });
    }

    /**
     * Resets the app back to default settings.
     */
    public reset(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            chrome.storage.sync.clear(
                () => this.callRejectOnError(resolve, reject));
        });
    }

    private set(items: Settings): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            chrome.storage.sync.set(
                items,
                () => {
                    if(chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        // Update the settings object with the new value
                        Object.assign(this.settings, items);
                        resolve();
                    }
                });
        });
    }

    /**
     * Calls reject(chrome.runtime.lastError) if there was an error; calls resolve(); otherwise.
     */
    private callRejectOnError(resolve, reject): void {
        if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
        }

        resolve();
    }
}