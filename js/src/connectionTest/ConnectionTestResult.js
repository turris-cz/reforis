/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    ipv4: PropTypes.string,
    ipv4_gateway: PropTypes.string,
    ipv6: PropTypes.string,
    ipv6_gateway: PropTypes.string,
    dns: PropTypes.string,
    dnssec: PropTypes.string,
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
    result: PropTypes.string,
    state: PropTypes.number,
};

function ConnectionTestResultItem({ type, result, state }) {
    return (
        <tr>
            <th scope="row">{type}</th>
            <td className="text-end">
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
    result: PropTypes.string,
};

function ConnectionTestIcon({ result }) {
    let icon;
    let iconColor;
    let title;

    switch (result) {
        case "OK":
            title = _("Connection test successful");
            icon = "check";
            iconColor = "success";
            break;
        case "FAILED":
            title = _("Connection test failed");
            icon = "times";
            iconColor = "danger";
            break;
        case "UNKNOWN":
            title = _("Connection test cannot be determined");
            icon = "question";
            iconColor = "warning";
            break;
        default:
            title = _("Connection test not started");
            icon = "minus";
            iconColor = "secondary";
    }
    return (
        <span className={`text-${iconColor}`}>
            <FontAwesomeIcon icon={`fa-solid fa-${icon}`} title={title} />
        </span>
    );
}
