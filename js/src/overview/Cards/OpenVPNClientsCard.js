/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAPIGet, withSpinnerOnSending, withErrorMessage } from "foris";
import moment from "moment";
import PropTypes from "prop-types";
import { renderToString } from "react-dom/server";

import { API_MODULE_URLs } from "common/API";
import Card from "overview/Cards/Card";
import usePopover from "utils/usePopover";

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
            handleRefresh={getOpenVPNClients}
        />
    );
}

OpenVPNClientsCard.propTypes = {
    clients: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.object),
    ]).isRequired,
    handleRefresh: PropTypes.func.isRequired,
};

function OpenVPNClientsCard({ clients, handleRefresh }) {
    const activeOpenVPNClients =
        clients &&
        clients
            .filter(
                (client) =>
                    client.status === "valid" && client.connections.length !== 0
            )
            .slice(0, 7)
            .sort((a, b) => a.connected_since - b.connected_since)
            .map((client) => (
                <OpenVPNClientsRow key={client.id} client={client} />
            ));

    return (
        <Card
            title={_("OpenVPN Clients")}
            linkTo="/openvpn/client-registration"
            linkTitle={_("Go to OpenVPN Client Settings")}
            refreshBtn
            onRefresh={handleRefresh}
        >
            {clients && clients.length !== 0 ? (
                <div className="table-responsive">
                    <table className="table table-borderless table-hover col-12 mb-0">
                        <tbody>
                            {activeOpenVPNClients &&
                            activeOpenVPNClients.length !== 0 ? (
                                activeOpenVPNClients
                            ) : (
                                <tr>
                                    <td className="text-muted">
                                        {_(
                                            "Currently, there are no connected OpenVPN clients."
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-muted">
                    {_("There are no OpenVPN clients.")}
                </p>
            )}
        </Card>
    );
}

const OpenVPNClientsCardWithErrorAndSpinner = withSpinnerOnSending(
    withErrorMessage(OpenVPNClientsCard)
);

OpenVPNClientsRow.propTypes = {
    client: PropTypes.object.isRequired,
};

function OpenVPNClientsRow({ client }) {
    const timeFromNow = (time) =>
        moment(time).locale(ForisTranslations.locale).fromNow();

    const popoverContent = (
        <>
            <p className="mb-0 text-nowrap">
                {client.connections[0].address}:{client.connections[0].port} -{" "}
                {timeFromNow(client.connections[0].connected_since)}
            </p>
            <hr className="my-2" />
            <div className="d-flex gap-2 justify-content-between">
                <div className="text-nowrap">
                    {_("Total In: ")}
                    {formatBytes(
                        client.connections.reduce(
                            (acc, connection) => acc + connection.out_bytes,
                            0
                        )
                    )}
                </div>
                <div className="text-nowrap">
                    {_("Total Out: ")}
                    {formatBytes(
                        client.connections.reduce(
                            (acc, connection) => acc + connection.in_bytes,
                            0
                        )
                    )}
                </div>
            </div>
        </>
    );
    const popoverContentString = renderToString(popoverContent);

    const popoverRef = usePopover(
        client.name,
        popoverContentString,
        "top",
        "click hover"
    );

    return (
        <tr>
            <th scope="row">
                {client.name}
                {client.connections.length !== 0 && (
                    <FontAwesomeIcon
                        icon="fa-solid fa-check"
                        className="ms-2 text-success"
                        title={_("Connected")}
                    />
                )}
            </th>
            <td className="text-end">
                {client.connections.length === 0 ? (
                    <FontAwesomeIcon
                        icon="fa-solid fa-minus"
                        className="text-secondary"
                        title={_("Disconnected")}
                    />
                ) : (
                    <span ref={popoverRef} className="help">
                        <FontAwesomeIcon icon="fa-solid fa-info-circle" />
                    </span>
                )}
            </td>
        </tr>
    );
}

function formatBytes(bytes) {
    if (bytes === 0) {
        return "0 B";
    }
    const k = 1024;
    const dm = 1;

    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}
