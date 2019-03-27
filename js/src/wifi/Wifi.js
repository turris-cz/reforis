/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from 'react'
import update from 'immutability-helper';

import WifiForm from './WifiForm';
import {ForisSettingWrapper, STATES} from "../settingsHelpers/Wrappers";
import SettingsSubmitButton from "../settingsHelpers/SettingsSubmitButton";

const HTMODES = {
    NOHT: _('Disabled'),
    HT20: _('802.11n - 20 MHz wide channel'),
    HT40: _('802.11n - 40 MHz wide channel'),
    VHT20: _('802.11ac - 20 MHz wide channel'),
    VHT40: _('802.11ac - 40 MHz wide channel'),
    VHT80: _("802.11ac - 80 MHz wide channel"),
};

const HWMODES = {
    '11g': _('2.4'),
    '11a': _('5')
};

class WifiBase extends React.Component {
    componentDidMount() {
        this.validate();
    }

    //TODO: There is something similar should be use in other forms, so good to extract to other HOC.
    handleWifiFormChange = (deviceId, target) => {
        let value = target.value;
        if (target.type === 'checkbox')
            value = target.checked;
        else if (target.name === 'channel')
            value = parseInt(target.value);

        // Delete postfix id from hwmode radios names because it's not needed here but in HTML it should have
        // different names.
        const name = target.name.startsWith('hwmode') ? 'hwmode' : target.name;

        this.updateDevice(deviceId, name, value);
    };

    handleGuestWifiFormChange = (deviceId, target) => {
        const newGuestWifiState = update(
            this.props.formData.devices[deviceId].guest_wifi,
            {[target.name]: {$set: target.type === 'checkbox' ? target.checked : target.value}}
        );

        this.updateDevice(deviceId, 'guest_wifi', newGuestWifiState);
    };

    updateDevice(deviceId, target, value) {
        const device = this.props.formData.devices[deviceId];
        let newDeviceState = update(
            device,
            {[target]: {$set: value}}
        );
        newDeviceState = update(
            newDeviceState,
            {errors: {$set: WifiBase.validateDevice(newDeviceState)}}
        );

        this.props.updateFormData((formData) =>
            update(
                formData,
                {devices: {$splice: [[deviceId, 1, newDeviceState]]}}
            ))
    }

    getChannelChoices = (deviceId) => {
        const device = this.props.formData.devices[deviceId];
        let channelChoices = {};

        device.available_bands.forEach((availableBand) => {
            if (availableBand.hwmode !== device.hwmode) return;

            availableBand.available_channels.forEach((availableChannel) => {
                channelChoices[availableChannel.number.toString()] = `
                        ${availableChannel.number}
                        (${availableChannel.frequency} MHz ${availableChannel.radar ? ' ,DFS' : ''})
                    `;
            })
        });

        channelChoices['0'] = _('auto');
        return channelChoices
    };

    getHtmodeChoices = (deviceId) => {
        const device = this.props.formData.devices[deviceId];
        let htmodeChoices = {};

        device.available_bands.forEach((availableBand) => {
            if (availableBand.hwmode !== device.hwmode)
                return;

            availableBand.available_htmodes.forEach((availableHtmod) => {
                htmodeChoices[availableHtmod] = HTMODES[availableHtmod]
            })
        });
        return htmodeChoices
    };

    getHwmodeChoices = (deviceId) => {
        const device = this.props.formData.devices[deviceId];

        return device.available_bands.map((availableBand) => {
            return {
                label: HWMODES[availableBand.hwmode],
                value: availableBand.hwmode,
            }
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.setFormState(STATES.UPDATE);
        const data = this.getPreparedDataToSubmit();
        this.props.postSettings(data);
    };

    getPreparedDataToSubmit() {
        let data = {'devices': []};

        this.props.formData.devices.forEach((device, idx) => {
            data.devices[idx] = {...device};
        });

        data.devices.forEach((device, idx) => {
            delete device['available_bands'];
            delete device['errors'];

            if (!device.enabled) {
                data.devices[idx] = {id: device.id, enabled: false};
                return;
            }

            if (!device.guest_wifi.enabled)
                data.devices[idx].guest_wifi = {enabled: false};
        });

        return data;
    }

    validate() {
        if (!this.props.formData) return;

        this.props.formData.devices.forEach((device) => {
            this.updateDevice(device.id, 'errors', WifiBase.validateDevice(device));
        });
    }

    static validateDevice(device) {
        if (!device.enabled) return {};

        let errors = {};
        if (device.SSID.length > 32)
            errors.SSID = _('SSID can\'t be longer than 32 symbols');
        if (device.password.length < 8)
            errors.password = _('Password must contain at least 8 symbols');

        if (!device.guest_wifi.enabled) return errors;
        if (device.guest_wifi.password.length < 8)
            errors.guestWifiPassword = _('Password must contain at least 8 symbols');

        return errors;
    }

    isValid() {
        if (!this.props.formData) return;

        let valid = true;
        this.props.formData.devices.forEach((device) => {
            if (typeof device.errors !== 'undefined' && Object.keys(device.errors).length !== 0)
                valid = false;
        });
        return valid
    }


    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <p>{_(
                    'If you want to use your router as a Wi-Fi access point, enable Wi-Fi here and fill in an SSID ' +
                    '(the name of the access point) and a corresponding password. You can then set up your  mobile ' +
                    'devices, using the QR code available within the form.'
                )}</p>

                {this.getForms()}
                <SettingsSubmitButton
                    disable={!this.isValid()}
                    state={this.props.formState}
                    remindsToNWRestart={this.props.remindsToNWRestart}
                />
            </form>
        );
    }

    getForms() {
        if (!this.props.formData) return;

        return this.props.formData.devices.map((device) =>
            <div key={device.id}>
                <WifiForm
                    {...device}

                    getChannelChoices={this.getChannelChoices}
                    getHtmodeChoices={this.getHtmodeChoices}
                    getHwmodeChoices={this.getHwmodeChoices}

                    onWifiFormChange={this.handleWifiFormChange}
                    onGuestWifiFormChange={this.handleGuestWifiFormChange}

                    disabled={this.props.formState !== STATES.READY}
                />
            </div>
        );
    }
}

const Wifi = ForisSettingWrapper(WifiBase, 'wifi');
export default Wifi;
