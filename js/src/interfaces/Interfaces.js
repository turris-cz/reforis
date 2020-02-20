/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { ForisForm } from "foris";
import API_URLs from "common/API";

import InterfacesForm from "./InterfacesForm";
import { NETWORKS_TYPES } from "./constants";

Interfaces.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function Interfaces({ ws }) {
    return (
        <>
            <h1>{_("Network Interfaces")}</h1>
            <p>
                {_(`
Here you can configure the settings of the network interfaces on your device. You can switch the physical
network interfaces among networks. If you are unsure what to set here use the default settings.
        `)}
            </p>
            <h4>{_("WAN")}</h4>
            <p>
                {_(`
It acts as an external network connection. Firewall rules should be applied here. It can only contain a
single interface.
        `)}
            </p>

            <h4>{_("LAN")}</h4>
            <p>
                {_(`
It acts as a local network connection. LAN should contain devices which are under your control and you
trust them. These devices can see each other and can access this web interface. It is recommended that the
LAN should contain at least one interface otherwise you might not be able to configure this device in an
easy way.
        `)}
            </p>

            <h4>{_("Guest Network")}</h4>
            <p>
                {_(`
It acts as a local network connection. Unlike LAN the devices in the guest network can't access
the configuration interface of this device and are only able to access WAN (internet). This network should
be used for devices which you don't fully trust. Note that you can also limit download/upload speed of the
devices connected to the guest network.
        `)}
            </p>
            <ForisForm
                ws={ws}
                forisConfig={{
                    endpoint: API_URLs.interfaces,
                    wsModule: "networks",
                }}
                prepDataToSubmit={prepDataToSubmit}
                validator={validateInterfaces}
            >
                <InterfacesForm />
            </ForisForm>
        </>
    );
}

function validateInterfaces(formData) {
    if (formData.networks.lan.length < 1) {
        return {
            networks: {
                lan: _("You have to assign at least one interface to this group."),
            },
        };
    }
    return undefined;
}

function prepDataToSubmit(formData) {
    const data = { networks: {}, firewall: formData.firewall };
    NETWORKS_TYPES.forEach((network) => {
        data.networks[network] = [];
    });
    NETWORKS_TYPES.forEach((network) => {
        formData.networks[network]
            .filter((i) => i.configurable)
            .forEach((i) => data.networks[network].push(i.id));
    });
    return data;
}
