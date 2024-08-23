/*
 * Copyright (C) 2019-2023 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAPIGet, withSpinnerOnSending, withErrorMessage } from "foris";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { API_MODULE_URLs } from "common/API";

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
        <div className="col mb-4">
            <div className="card h-100">
                <div className="card-body">
                    <h6 className="text-uppercase text-muted mb-2">
                        {_("OpenVPN Clients")}
                        <Link
                            to={{
                                pathname: "/openvpn/client-settings",
                            }}
                            className="text-secondary"
                            title={_("Go to OpenVPN Client Settings")}
                        >
                            <FontAwesomeIcon
                                icon="fa-solid fa-chevron-right"
                                className="float-right"
                            />
                        </Link>
                    </h6>
                    {typeof clients === "object" && clients.length !== 0 ? (
                        <form>
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
                                                        <i
                                                            className={`fas fa-${
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
                        </form>
                    ) : (
                        <p className="text-muted">
                            {_("There are no clients added yet.")}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

const OpenVPNClientsCardWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(OpenVPNClientsCard)
);
