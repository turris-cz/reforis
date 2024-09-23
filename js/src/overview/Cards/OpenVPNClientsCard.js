/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    useAPIGet,
    withSpinnerOnSending,
    withErrorMessage,
    ForisURLs,
} from "foris";
import PropTypes from "prop-types";

import { API_MODULE_URLs } from "common/API";
import Card from "overview/Cards/Card";

export default function OpenVPNClients() {
    const [getOpenVPNClientsResponse, getOpenVPNClients] = useAPIGet(
        API_MODULE_URLs.openvpnClients
    );
    useEffect(() => {
        getOpenVPNClients();
    }, [getOpenVPNClients]);

    return (
        <OpenVPNClientsCardWithErrorAndSpinner
            apiState={getOpenVPNClientsResponse.state}
            clients={getOpenVPNClientsResponse.data || {}}
        />
    );
}

OpenVPNClientsCard.propTypes = {
    clients: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.object),
    ]).isRequired,
};

function OpenVPNClientsCard({ clients }) {
    return (
        <Card
            title={_("OpenVPN Clients")}
            linkTo={ForisURLs.openvpnClientSettings}
            linkTitle={_("Go to OpenVPN Client Settings")}
        >
            {typeof clients === "object" && clients.length !== 0 ? (
                <div className="table-responsive">
                    <table className="table table-borderless table-hover col-sm-12">
                        <tbody>
                            {clients.slice(0, 5).map((client) => (
                                <tr key={client.id}>
                                    <th scope="row">
                                        <span>{client.id}</span>
                                    </th>
                                    <td className="text-end">
                                        <span
                                            className={`text-${
                                                client.enabled
                                                    ? "success"
                                                    : "danger"
                                            }`}
                                        >
                                            <FontAwesomeIcon
                                                icon={`fa-solid fa-${
                                                    client.enabled
                                                        ? "check"
                                                        : "times"
                                                }`}
                                            />
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-muted">
                    {_("There are no clients added yet.")}
                </p>
            )}
        </Card>
    );
}

const OpenVPNClientsCardWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(OpenVPNClientsCard)
);
