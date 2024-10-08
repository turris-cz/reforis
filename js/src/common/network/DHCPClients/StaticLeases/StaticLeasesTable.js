/*
 * Copyright (C) 2019-2023 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, useAPIDelete, API_STATE } from "foris";
import moment from "moment";
import PropTypes from "prop-types";

import API_URLs from "common/API";

StaticLeasesTable.propTypes = {
    clients: PropTypes.arrayOf(PropTypes.object),
    editStaticLease: PropTypes.func,
};

export default function StaticLeasesTable({ clients, editStaticLease }) {
    if (!clients || clients.length === 0) {
        return (
            <p className="text-muted text-center">{_("No clients found.")}</p>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-hover">
                <thead className="thead-light">
                    <tr className="text-left">
                        <th>{_("Hostname")}</th>
                        <th>{_("IPv4 Address")}</th>
                        <th>{_("MAC Address")}</th>
                        <th className="text-center">{_("Expires")}</th>
                        <th className="text-center">{_("Active")}</th>
                        <th aria-label={_("Actions")} />
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                        <DHCPClientsTableItem
                            key={client.mac}
                            client={client}
                            editStaticLease={editStaticLease}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

DHCPClientsTableItem.propTypes = {
    client: PropTypes.object,
    editStaticLease: PropTypes.func,
};

export function DHCPClientsTableItem({ client, editStaticLease }) {
    const { hostname, ip, mac, expires, active, static: isStatic } = client;

    const clientExpires =
        expires && !isStatic
            ? moment.unix(expires).format("YYYY-MM-DD HH:mm")
            : _("Never");

    return (
        <tr>
            <td className="align-middle">{hostname}</td>
            <td className="align-middle">{ip}</td>
            <td className="align-middle">{mac}</td>
            <td className="text-center align-middle">{clientExpires}</td>
            <td className="text-center align-middle">
                <FontAwesomeIcon
                    icon={`fa-solid ${active ? "fa-check" : "fa-times"}`}
                    className={active ? "text-success" : "text-danger"}
                    title={
                        active ? _("Device is active") : _("Device is inactive")
                    }
                />
            </td>
            <td className="align-middle" align="right">
                <StaticLeaseActions
                    client={client}
                    editStaticLease={editStaticLease}
                />
            </td>
        </tr>
    );
}

StaticLeaseActions.propTypes = {
    client: PropTypes.object,
    editStaticLease: PropTypes.func,
    disabled: PropTypes.bool,
};

function StaticLeaseActions({ client, editStaticLease, disabled }) {
    const [deleteStaticLeaseResponse, deleteStaticLease] = useAPIDelete(
        `${API_URLs.lanClients}/${client.mac}`
    );
    const buttonDisabled =
        disabled || deleteStaticLeaseResponse.state === API_STATE.SENDING;

    return client.static ? (
        <div
            className="btn-group btn-group-sm mb-0"
            role="group"
            aria-label={_("Actions")}
        >
            <Button
                onClick={() => editStaticLease(client)}
                disabled={buttonDisabled}
            >
                <span className="d-xl-none">
                    <FontAwesomeIcon
                        icon="fa-solid fa-edit"
                        className="fa-sm"
                    />
                </span>
                <span className="d-none d-xl-block">
                    <FontAwesomeIcon
                        icon="fa-solid fa-edit"
                        className="fa-sm me-1"
                    />
                    {_("Edit")}
                </span>
            </Button>

            <Button
                onClick={() => deleteStaticLease(client.mac)}
                className="btn-danger"
                disabled={buttonDisabled}
            >
                <span className="d-xl-none">
                    <FontAwesomeIcon
                        icon="fa-solid fa-trash"
                        className="fa-sm"
                    />
                </span>
                <span className="d-none d-xl-block">
                    <FontAwesomeIcon
                        icon="fa-solid fa-trash"
                        className="fa-sm me-1"
                    />
                    {_("Delete")}
                </span>
            </Button>
        </div>
    ) : (
        <Button
            className="btn btn-sm btn-outline-success"
            onClick={() => editStaticLease(client)}
        >
            {_("Set Static")}
        </Button>
    );
}
