/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { Portal } from "foris";
import PropTypes from "prop-types";

import DHCPClients from "common/network/DHCPClients";

GuestNetworkDHCPClientsList.propTypes = {
    formData: PropTypes.shape({
        enabled: PropTypes.bool.isRequired,
        dhcp: PropTypes.shape({
            enabled: PropTypes.bool.isRequired,
            clients: PropTypes.arrayOf(PropTypes.object).isRequired,
        }).isRequired,
    }),
};

export default function GuestNetworkDHCPClientsList({ formData }) {
    if (!formData.enabled || !formData.dhcp.enabled) return null;

    return (
        <Portal containerId="dhcp-clients-container">
            <DHCPClients clients={formData.dhcp.clients} />
        </Portal>
    );
}
