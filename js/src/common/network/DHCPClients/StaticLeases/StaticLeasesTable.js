/*
 * Copyright (C) 2019-2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, RichTable, SpinnerElement, ThreeDotsMenu } from "foris";
import moment from "moment";
import PropTypes from "prop-types";

StaticLeasesTable.propTypes = {
    leases: PropTypes.arrayOf(PropTypes.object),
    onEditLease: PropTypes.func,
    onDeleteLease: PropTypes.func,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    leaseToBeDeleted: PropTypes.object,
};

export default function StaticLeasesTable({
    leases,
    onEditLease,
    onDeleteLease,
    disabled,
    loading,
    leaseToBeDeleted,
}) {
    if (!leases || leases.length === 0) {
        return (
            <p className="text-muted text-center mb-1">
                {_("No clients found.")}
            </p>
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
                loading={loading}
                leaseToBeDeleted={leaseToBeDeleted}
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
            data={leases}
            columns={columns}
            withPagination
            disabled={disabled}
        />
    );
}

StaticLeaseActions.propTypes = {
    client: PropTypes.object,
    onEditLease: PropTypes.func,
    onDeleteLease: PropTypes.func,
    loading: PropTypes.bool,
    leaseToBeDeleted: PropTypes.object,
};

function StaticLeaseActions({
    client,
    onEditLease,
    onDeleteLease,
    loading: isLoading,
    leaseToBeDeleted,
}) {
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

    if (isLoading && client.mac === leaseToBeDeleted?.mac) {
        return <SpinnerElement small className="text-primary" />;
    }
    if (client.static) {
        return (
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
        );
    }
    return (
        <Button
            className="btn btn-sm btn-outline-success"
            onClick={handleEditStaticLease}
        >
            {_("Set Static")}
        </Button>
    );
}

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
