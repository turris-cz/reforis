/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { ForisForm, formFieldsSize } from "foris";
import update from "immutability-helper";
import PropTypes from "prop-types";

import API_URLs from "common/API";
import ConnectionTest from "connectionTest/ConnectionTest";

import MACForm, { validateMACForm } from "./MACForm";
import VLANForm, { validateVLANFrom } from "./VLANForm";
import WAN6Form, { validateWAN6Form } from "./WAN6Form";
import WANForm, { validateWANForm } from "./WANForm";

WAN.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function WAN({ ws }) {
    return (
        <>
            <h1>{_("WAN")}</h1>
            <p>
                {_(
                    "Here you can specify your WAN port settings if instructed to do so by your ISP (internet service provider). Usually, it can be left untouched if your router is connected to the Internet via a cable or DSL modem."
                )}
            </p>
            <ForisForm
                ws={ws}
                forisConfig={{
                    endpoint: API_URLs.wan,
                    wsModule: "wan",
                }}
                prepData={prepData}
                prepDataToSubmit={prepDataToSubmit}
                validator={validator}
            >
                <WANForm />
                <WAN6Form />
                <MACForm />
                <VLANForm />
            </ForisForm>
            <div className={`${formFieldsSize}`}>
                <h2>{_("Connection Test")}</h2>
                <p
                    dangerouslySetInnerHTML={{
                        __html: _(
                            "Here you can examine your connection settings. Wait a while to establish the connection. Remember to click the <b>Save</b> button after you have tested that it works."
                        ),
                    }}
                />
                <ConnectionTest ws={ws} type="wan" />
            </div>
        </>
    );
}

function prepData(formData) {
    // Create empty form fields if nothing has got from the server.
    const wan6_6in4 = update((formData.wan6_settings || {}).wan6_6in4 || {}, {
        dynamic_ipv4: {
            $set: ((formData.wan6_settings || {}).wan6_6in4 || {})
                .dynamic_ipv4 || { enabled: false },
        },
    });
    if (formData.wan_settings.wan_type === "none")
        formData.wan_settings.wan_type = "dhcp";
    return update(formData, {
        wan_settings: {
            wan_dhcp: { $set: formData.wan_settings.wan_dhcp || {} },
            wan_static: { $set: formData.wan_settings.wan_static || {} },
            wan_pppoe: { $set: formData.wan_settings.wan_pppoe || {} },
        },
        wan6_settings: {
            wan6_dhcpv6: {
                $set: formData.wan6_settings.wan6_dhcpv6 || { duid: "" },
            },
            wan6_static: { $set: formData.wan6_settings.wan6_static || {} },
            wan6_6to4: { $set: formData.wan6_settings.wan6_6to4 || {} },
            wan6_6in4: { $set: wan6_6in4 },
        },
    });
}

function prepDataToSubmit(formData) {
    const dataToSubmit = {
        wan_settings: deleteUnnecessarySettings(
            formData.wan_settings.wan_type,
            formData.wan_settings
        ),
        wan6_settings: deleteUnnecessarySettings(
            formData.wan6_settings.wan6_type,
            formData.wan6_settings
        ),
        mac_settings: formData.mac_settings,
        vlan_settings: formData.vlan_settings,
    };

    if (
        formData.wan6_settings.wan6_type === "6in4" &&
        !formData.wan6_settings.wan6_6in4.dynamic_ipv4.enabled
    ) {
        formData.wan6_settings.wan6_6in4.dynamic_ipv4 = { enabled: false };
    }

    if (!formData.mac_settings.custom_mac_enabled)
        delete dataToSubmit.mac_settings.custom_mac;

    delete dataToSubmit.mac_settings.mac_address;

    if (!formData.vlan_settings.enabled) {
        delete dataToSubmit.vlan_settings.vlan_id;
    }

    return dataToSubmit;
}

function deleteUnnecessarySettings(type, settings) {
    return Object.keys(settings)
        .filter((setting) => setting.endsWith(type) || setting.endsWith("type"))
        .reduce(
            (accumulator, currentValue) => ({
                ...accumulator,
                [currentValue]: settings[currentValue],
            }),
            {}
        );
}

function validator(formData) {
    const errors = {
        wan_settings: validateWANForm(formData.wan_settings),
        wan6_settings: validateWAN6Form(formData.wan6_settings),
        mac_settings: validateMACForm(formData.mac_settings),
        vlan_settings: validateVLANFrom(formData.vlan_settings),
    };
    if (
        errors.wan_settings ||
        errors.wan6_settings ||
        errors.mac_settings ||
        errors.vlan_settings
    )
        return errors;
    return null;
}
