/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";
import moment from "moment";

DHCPClientsTable.propTypes = {
    clients: PropTypes.arrayOf(PropTypes.object),
};

export default function DHCPClientsTable({ clients }) {
    return (
        <>
            {clients.length === 0 ? (
                <p className="text-muted text-center">
                    {_("No clients found.")}
                </p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead className="thead-light">
                            <tr className="text-left">
                                <th>{_("Hostname")}</th>
                                <th>{_("IPv4 Address")}</th>
                                <th>{_("MAC Address")}</th>
                                <th className="text-center">{_("Expires")}</th>
                                <th className="text-center">{_("Active")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client) => (
                                <DHCPClientsTableItem
                                    key={client.ip}
                                    {...client}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

DHCPClientsTableItem.propTypes = {
    ip: PropTypes.string.isRequired,
    expires: PropTypes.number.isRequired,
    mac: PropTypes.string.isRequired,
    hostname: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
};

export function DHCPClientsTableItem({ ip, expires, mac, hostname, active }) {
    return (
        <tr className="text-left">
            <td>{hostname}</td>
            <td>{ip}</td>
            <td>{mac}</td>
            <td className="text-center">
                {expires
                    ? moment.unix(expires).format("YYYY-MM-DD HH:mm")
                    : _("Never")}
            </td>
            <td className="text-center">
                <i
                    className={`fas ${
                        active
                            ? "fa-check text-success"
                            : "fa-times text-danger"
                    }`}
                    title={
                        active ? _("Device is active") : _("Device is inactive")
                    }
                />
            </td>
        </tr>
    );
}
