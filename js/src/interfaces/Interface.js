/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

import { INTERFACE_STATES, INTERFACE_TYPES } from "./constants";

Interface.propTypes = {
    type: PropTypes.oneOf(Object.keys(INTERFACE_TYPES)).isRequired,
    slot: PropTypes.string.isRequired,
    state: PropTypes.oneOf(Object.keys(INTERFACE_STATES)).isRequired,
    configurable: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    vlan_id: PropTypes.number,
};

export default function Interface({
    type,
    slot,
    state,
    configurable,
    isSelected,
    onClick,
    vlan_id,
}) {
    return (
        <button
            type="button"
            className={`text-body interface ${isSelected ? "interface-selected" : ""}`.trim()}
            onClick={onClick}
        >
            <InterfaceIcon
                type={type}
                state={state}
                configurable={configurable}
            />
            <h5 className="mb-0">{slot}</h5>
            {vlan_id && (
                <span
                    className="badge text-bg-info ml-0"
                    title={`VLAN ID: ${vlan_id}`}
                >
                    {`VLAN: ${vlan_id}`}
                </span>
            )}
        </button>
    );
}

InterfaceIcon.propTypes = {
    type: PropTypes.oneOf(Object.keys(INTERFACE_TYPES)).isRequired,
    configurable: PropTypes.bool.isRequired,
};

function InterfaceIcon({ type, configurable, ...props }) {
    let icon = null;
    if (type === INTERFACE_TYPES.eth) {
        icon = <EthInterfaceIcon {...props} />;
    } else if (type === INTERFACE_TYPES.wifi) {
        icon = <WiFiInterfaceIcon {...props} />;
    } else if (type === INTERFACE_TYPES.wwan) {
        icon = <WWANInterfaceIcon {...props} />;
    }

    return icon;
}

EthInterfaceIcon.propTypes = {
    state: PropTypes.oneOf(Object.keys(INTERFACE_STATES)).isRequired,
};

function EthInterfaceIcon({ state }) {
    return (
        <span className="fa-stack fa-2x">
            <FontAwesomeIcon
                icon="fa-regular fa-square"
                className={`fa-stack-2x ${
                    state === "down" ? "opacity-25" : ""
                }`.trim()}
            />
            <FontAwesomeIcon
                icon="fa-solid fa-ethernet"
                className={`fa-stack-1x ${
                    state === "down" ? "opacity-25" : ""
                }`.trim()}
            />
        </span>
    );
}

WiFiInterfaceIcon.propTypes = {
    state: PropTypes.oneOf(Object.keys(INTERFACE_STATES)).isRequired,
};

function WiFiInterfaceIcon({ state }) {
    return (
        <span className="fa-stack fa-2x">
            <FontAwesomeIcon icon="fa-solid fa-wifi" className="fa-stack-1x" />
            {state === "down" && (
                <FontAwesomeIcon
                    icon="fa-solid fa-slash"
                    className="fa-stack-1x"
                />
            )}
        </span>
    );
}

WWANInterfaceIcon.propTypes = {
    state: PropTypes.oneOf(Object.keys(INTERFACE_STATES)).isRequired,
};

function WWANInterfaceIcon({ state }) {
    return (
        <span className="fa-stack fa-2x">
            <FontAwesomeIcon
                icon="fa-solid fa-signal"
                className="fa-stack-1x"
            />
            {state === "down" && (
                <FontAwesomeIcon
                    icon="fa-solid fa-slash"
                    className="fa-stack-1x"
                />
            )}
        </span>
    );
}
