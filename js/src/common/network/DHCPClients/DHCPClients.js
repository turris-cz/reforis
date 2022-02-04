/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import { formFieldsSize, WebSockets } from "foris";
import DHCPClientsTable from "./DHCPClientsTable";
import DHCPClientsWithStaticLeases from "./DHCPClientsWithStaticLeases";

DHCPClients.propTypes = {
    clients: PropTypes.arrayOf(PropTypes.object),
    withStaticLeases: PropTypes.bool,
    ws: PropTypes.instanceOf(WebSockets),
};

export default function DHCPClients({ clients, withStaticLeases, ws }) {
    return (
        <div className={formFieldsSize}>
            <h2>{_("DHCP Client List")}</h2>
            <p>
                {_(
                    "This list contains all devices that are connected to the network through wired or wireless connections."
                )}
            </p>
            {withStaticLeases ? (
                <DHCPClientsWithStaticLeases ws={ws} />
            ) : (
                <DHCPClientsTable clients={clients} />
            )}
        </div>
    );
}
