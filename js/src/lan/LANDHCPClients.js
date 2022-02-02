/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import PropTypes from "prop-types";
import ReactDOM from "react-dom";

import DHCPClients from "common/network/DHCPClients";
import DHCP6Clients from "common/network/DHCP6Clients";
import { LAN_MODES } from "./LANForm";

LANDHCPClients.propTypes = {
    formData: PropTypes.shape({
        mode: PropTypes.oneOf(Object.keys(LAN_MODES)),
        mode_managed: PropTypes.shape({
            dhcp: PropTypes.shape({
                enabled: PropTypes.bool.isRequired,
                clients: PropTypes.arrayOf(PropTypes.object).isRequired,
                ipv6clients: PropTypes.arrayOf(PropTypes.object).isRequired,
            }).isRequired,
        }),
    }),
};

export default function LANDHCPClients({ formData }) {
    if (
        formData.mode !== LAN_MODES.managed ||
        !formData.mode_managed.dhcp.enabled
    )
        return null;

    const lanContainer = document.getElementById("dhcp-clients-container");

    return ReactDOM.createPortal(
        <>
            <DHCPClients clients={formData.mode_managed.dhcp.clients} />
            <DHCP6Clients
                ipv6clients={formData.mode_managed.dhcp.ipv6clients}
            />
        </>,
        lanContainer
    );
}
