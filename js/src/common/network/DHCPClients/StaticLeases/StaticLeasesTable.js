/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, useAPIDelete, API_STATE, RichTable } from "foris";
import moment from "moment";
import PropTypes from "prop-types";

import API_URLs from "common/API";

ActiveIcon.propTypes = {
    isActive: PropTypes.bool.isRequired,
};

function ActiveIcon({ isActive }) {
    return (
        <FontAwesomeIcon
            icon={`fa-solid ${isActive ? "fa-check" : "fa-times"}`}
            className={isActive ? "text-success" : "text-danger"}
            title={isActive ? _("Device is active") : _("Device is inactive")}
        />
    );
}

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

    function renderActiveIcon({ getValue }) {
        return <ActiveIcon isActive={getValue()} />;
    }

    function renderActions({ row }) {
        const client = row.original;
        return (
            <StaticLeaseActions
                client={client}
                editStaticLease={editStaticLease}
            />
        );
    }

    const columns = [
        {
            accessorKey: "hostname",
            header: _("Hostname"),
        },
        {
            accessorKey: "ip",
            header: _("IPv4 Address"),
        },
        {
            accessorKey: "mac",
            header: _("MAC Address"),
        },
        {
            accessorKey: "expires",
            header: _("Expires"),
            cell: ({ getValue, row }) => {
                const expires = getValue();
                const isStatic = row.original.static;
                return isStatic
                    ? _("Never")
                    : moment
                          .unix(expires)
                          .locale(ForisTranslations.locale)
                          .format("l LT");
            },
        },
        {
            accessorKey: "active",
            header: _("Active"),
            headerClassName: "d-flex justify-content-center",
            className: "text-center",
            cell: renderActiveIcon,
        },
        {
            accessorKey: "actions",
            header: _("Actions"),
            headerIsHidden: true,
            className: "text-end",
            cell: renderActions,
        },
    ];

    return <RichTable columns={columns} data={clients} withPagination />;
}

StaticLeaseActions.propTypes = {
    client: PropTypes.object,
    editStaticLease: PropTypes.func,
};

function StaticLeaseActions({ client, editStaticLease }) {
    const [deleteStaticLeaseResponse, deleteStaticLease] = useAPIDelete(
        `${API_URLs.lanClients}/${client.mac}`
    );
    const buttonDisabled =
        deleteStaticLeaseResponse.state === API_STATE.SENDING;

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
