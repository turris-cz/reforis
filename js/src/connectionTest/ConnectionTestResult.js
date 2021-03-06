/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { SpinnerElement } from "foris";
import PropTypes from "prop-types";

import { TEST_STATES } from "./hooks";

const TEST_TYPES = {
    ipv4: _("IPv4 connectivity"),
    ipv4_gateway: _("IPv4 gateway connectivity"),
    ipv6: _("IPv6 connectivity"),
    ipv6_gateway: _("IPv6 gateway connectivity"),
    dns: "DNS",
    dnssec: "DNSSEC",
};

ConnectionTestResults.propTypes = {
    ipv4: PropTypes.bool,
    ipv4_gateway: PropTypes.bool,
    ipv6: PropTypes.bool,
    ipv6_gateway: PropTypes.bool,
    dns: PropTypes.bool,
    dnssec: PropTypes.bool,
    state: PropTypes.number,
};

export default function ConnectionTestResults({ state, ...tests }) {
    return (
        <table className="table table-borderless table-hover col-sm-12">
            <tbody>
                {Object.keys(TEST_TYPES).map((type) =>
                    tests[type] !== undefined ? (
                        <ConnectionTestResultItem
                            key={type}
                            type={TEST_TYPES[type]}
                            result={tests[type]}
                            state={state}
                        />
                    ) : null
                )}
            </tbody>
        </table>
    );
}

ConnectionTestResultItem.propTypes = {
    type: PropTypes.string.isRequired,
    result: PropTypes.bool,
    state: PropTypes.number,
};

function ConnectionTestResultItem({ type, result, state }) {
    return (
        <tr>
            <th scope="row">{type}</th>
            <td className="text-right">
                {state === TEST_STATES.RUNNING ? (
                    <SpinnerElement small className="text-secondary" />
                ) : (
                    <ConnectionTestIcon result={result} />
                )}
            </td>
        </tr>
    );
}

ConnectionTestIcon.propTypes = {
    result: PropTypes.bool,
};

function ConnectionTestIcon({ result }) {
    let icon;
    let iconColor;
    let title;

    switch (result) {
        case true:
            title = _("Connection test successful");
            icon = "check";
            iconColor = "success";
            break;
        case false:
            title = _("Connection test failed");
            icon = "times";
            iconColor = "danger";
            break;
        default:
            title = _("Connection test not started");
            icon = "minus";
            iconColor = "secondary";
    }
    return (
        <span className={`text-${iconColor}`}>
            <i className={`fas fa-${icon}`} title={title} />
        </span>
    );
}
