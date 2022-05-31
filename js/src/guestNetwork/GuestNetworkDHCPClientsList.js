/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import PropTypes from "prop-types";
import ReactDOM from "react-dom";

import DHCPClients from "common/network/DHCPClients/DHCPClients";

GuestNetworkDHCPClientsList.propTypes = {
    formData: PropTypes.shape({
        dhcp: PropTypes.shape({
            enabled: PropTypes.bool.isRequired,
            clients: PropTypes.arrayOf(PropTypes.object).isRequired,
        }).isRequired,
    }),
};

export default function GuestNetworkDHCPClientsList({ formData }) {
    if (!formData.enabled || !formData.dhcp.enabled) return null;

    const container = document.getElementById("dhcp-clients-container");
    return ReactDOM.createPortal(
        <DHCPClients clients={formData.dhcp.clients} />,
        container
    );
}
