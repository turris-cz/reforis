/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import {
    ForisForm,
    validateIPv4Address,
    ForisURLs,
    undefinedIfEmpty,
    withoutUndefinedKeys,
} from "foris";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import API_URLs from "common/API";
import validateDHCP from "common/network/DHCPValidators";
import { getDHCPStart } from "common/network/utils";
import {
    validateNetworkMask,
    validateRequiredField,
} from "common/network/validators";

import GuestNetworkDHCPClientsList from "./GuestNetworkDHCPClientsList";
import GuestNetworkForm, { validateQoS } from "./GuestNetworkForm";
import GuestNetworkNotification from "./GuestNetworkNotification";

GuestNetwork.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function GuestNetwork({ ws }) {
    return (
        <>
            <h1>{_("Guest Network")}</h1>
            <div id="guest-notification" />
            <p>
                {_("The guest network is used for ")}
                <Link to={ForisURLs.wifiSettings}>{_("guest Wi-Fi")}</Link>
                {". "}
                {_(
                    "It is separated from your ordinary LAN. Devices connected to this network are allowed to access the internet but are not allowed to access the configuration interface of this device or the devices in LAN."
                )}
            </p>
            <ForisForm
                ws={ws}
                forisConfig={{
                    endpoint: API_URLs.guestNetwork,
                    wsModule: "guest",
                }}
                prepData={prepData}
                prepDataToSubmit={prepDataToSubmit}
                validator={validator}
            >
                <GuestNetworkForm />
                <GuestNetworkDHCPClientsList />
                <GuestNetworkNotification />
            </ForisForm>
            <div id="dhcp-clients-container" />
        </>
    );
}

function prepData(formData) {
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(formData.dhcp.start)) {
        // Be sure to convert start address only once.
        formData.dhcp.start = getDHCPStart(
            formData.ip,
            formData.dhcp.start
        ).toString();
    }
    return formData;
}

export function prepDataToSubmit(formData) {
    if (!formData.enabled) return { enabled: false };

    if (!formData.dhcp.enabled) {
        formData.dhcp = { enabled: false };
    } else {
        delete formData.dhcp.clients;
    }

    if (!formData.qos.enabled) formData.qos = { enabled: false };

    delete formData.interface_count;
    delete formData.interface_up_count;

    return formData;
}

export function validator(formData) {
    const errors = {
        ip:
            validateRequiredField(formData.ip) ||
            validateIPv4Address(formData.ip),
        netmask:
            validateRequiredField(formData.netmask) ||
            validateIPv4Address(formData.netmask) ||
            validateNetworkMask(formData.netmask),
    };

    if (formData.qos.enabled) {
        errors.qos = validateQoS(formData.qos);
    }

    if (formData.dhcp.enabled) {
        errors.dhcp = validateDHCP(
            formData.dhcp,
            formData.ip,
            formData.netmask,
            errors.ip || errors.netmask
        );
    }

    return undefinedIfEmpty(withoutUndefinedKeys(errors));
}
