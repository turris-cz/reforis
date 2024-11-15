/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formFieldsSize, RichTable } from "foris";
import moment from "moment";
import PropTypes from "prop-types";

DHCP6Clients.propTypes = {
    ipv6clients: PropTypes.arrayOf(PropTypes.object),
};

DHCP6Clients.defaultProps = {
    ipv6clients: [],
};

export default function DHCP6Clients({ ipv6clients }) {
    function renderActiveIcon({ getValue }) {
        return <ActiveIcon isActive={getValue()} />;
    }

    const columns = [
        {
            accessorKey: "hostname",
            header: _("Hostname"),
        },
        {
            accessorKey: "ipv6",
            header: _("IPv6 Address"),
        },
        {
            accessorKey: "duid",
            header: _("DUID"),
        },
        {
            accessorKey: "expires",
            header: _("Expires"),
            cell: ({ getValue }) => {
                const expires = getValue();
                return moment
                    .utc(expires)
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
    ];

    const data = ipv6clients.map((client) => ({
        hostname: client.hostname,
        ipv6: client.ipv6,
        duid: client.duid,
        active: client.active,
        expires: client.expires
            ? moment
                  .unix(client.expires)
                  .locale(ForisTranslations.locale)
                  .format("l LT")
            : _("Never"),
    }));

    return (
        <div className={formFieldsSize}>
            <h2>{_("IPv6 DHCP Client List")}</h2>
            <p>
                {_(
                    "This list contains all devices that are connected to the network through wired or wireless connections using IPv6."
                )}
            </p>
            {ipv6clients.length === 0 ? (
                <p className="text-muted text-center">
                    {_("No clients found.")}
                </p>
            ) : (
                <RichTable columns={columns} data={data} withPagination />
            )}
        </div>
    );
}

ActiveIcon.propTypes = {
    isActive: PropTypes.bool,
};

function ActiveIcon({ isActive }) {
    if (isActive) {
        return (
            <FontAwesomeIcon
                icon="fa-check"
                className="text-success text-center"
                title={_("Device is active")}
            />
        );
    }
    return (
        <FontAwesomeIcon
            icon="fa-times"
            className="text-danger"
            title={_("Device is inactive")}
        />
    );
}
