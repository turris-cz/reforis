/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, RichTable, ThreeDotsMenu } from "foris";
import moment from "moment";
import PropTypes from "prop-types";

import { useStaticLeaseWS } from "common/network/DHCPClients/hooks";

ActiveIcon.propTypes = {
    isActive: PropTypes.bool,
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
    ws: PropTypes.object,
    staticLeases: PropTypes.arrayOf(PropTypes.object),
    onEditLease: PropTypes.func,
    onDeleteLease: PropTypes.func,
};

export default function StaticLeasesTable({
    ws,
    staticLeases,
    onEditLease,
    onDeleteLease,
}) {
    const richTableRef = useRef();

    const updateTableData = (newData) => {
        if (richTableRef.current) {
            richTableRef.current.setTableData(newData);
        }
    };

    useStaticLeaseWS(ws, updateTableData);

    if (!staticLeases || staticLeases.length === 0) {
        return (
            <p className="text-muted text-center mb-1">
                {_("No clients found.")}
            </p>
        );
    }

    function renderActiveIcon({ getValue }) {
        const isActive = getValue();
        return <ActiveIcon isActive={isActive} />;
    }

    function renderActions({ row }) {
        const client = row.original;
        return (
            <StaticLeaseActions
                client={client}
                onEditLease={onEditLease}
                onDeleteLease={onDeleteLease}
            />
        );
    }

    function renderExpires({ getValue, row }) {
        const expires = getValue();
        const isStatic = row.original.static;
        return isStatic ? (
            <span>{_("Never")}</span>
        ) : (
            <span>
                {moment
                    .unix(expires)
                    .locale(ForisTranslations.locale)
                    .format("l LT")}
            </span>
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
            cell: renderExpires,
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

    return (
        <RichTable
            ref={richTableRef}
            columns={columns}
            data={staticLeases}
            withPagination
        />
    );
}

StaticLeaseActions.propTypes = {
    client: PropTypes.object,
    onEditLease: PropTypes.func,
    onDeleteLease: PropTypes.func,
};

function StaticLeaseActions({ client, onEditLease, onDeleteLease }) {
    const handleEditStaticLease = () => {
        onEditLease(client);
    };

    const handleDeleteStaticLease = () => {
        onDeleteLease(client);
    };

    const threeDotsMenuItems = [
        {
            id: "edit",
            onClick: handleEditStaticLease,
            icon: "fa-solid fa-edit",
            text: _("Edit"),
        },
        {
            id: "delete",
            onClick: handleDeleteStaticLease,
            icon: "fa-solid fa-trash",
            text: _("Delete"),
        },
    ];

    return client.static ? (
        <ThreeDotsMenu data-testid="three-dots-menu">
            {threeDotsMenuItems.map((item) => (
                <button
                    type="button"
                    key={item.id}
                    onClick={item.onClick}
                    className="dropdown-item"
                    data-testid={`three-dots-menu-${item.id}`}
                >
                    <FontAwesomeIcon
                        icon={item.icon}
                        className="me-1"
                        width="1rem"
                        size="sm"
                    />
                    {item.text}
                </button>
            ))}
        </ThreeDotsMenu>
    ) : (
        <Button
            className="btn btn-sm btn-outline-success"
            onClick={handleEditStaticLease}
        >
            {_("Set Static")}
        </Button>
    );
}
