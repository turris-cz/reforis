/*
 * Copyright (C) 2019-2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { formFieldsSize } from "foris";
import PropTypes from "prop-types";

import DHCPClientsTable from "common/network/DHCPClients/DHCPClientsTable";
import DHCPClientsWithStaticLeases from "common/network/DHCPClients/DHCPClientsWithStaticLeases";

DHCPClients.propTypes = {
    clients: PropTypes.arrayOf(PropTypes.object),
    withStaticLeases: PropTypes.bool,
};

export default function DHCPClients({ clients, withStaticLeases }) {
    return (
        <div className={formFieldsSize}>
            <h2>{_("DHCP Client List")}</h2>
            <p>
                {_(
                    "This list contains all devices that are connected to the network through wired or wireless connections."
                )}
            </p>
            {withStaticLeases ? (
                <DHCPClientsWithStaticLeases />
            ) : (
                <DHCPClientsTable clients={clients} />
            )}
        </div>
    );
}
