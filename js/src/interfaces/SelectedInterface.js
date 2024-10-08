/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Select } from "foris";
import PropTypes from "prop-types";

import {
    BUSES,
    INTERFACE_STATES,
    INTERFACE_TYPES,
    NETWORKS_CHOICES,
} from "./constants";

SelectedInterface.propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.keys(INTERFACE_TYPES)).isRequired,
    state: PropTypes.oneOf(Object.keys(INTERFACE_STATES)).isRequired,
    bus: PropTypes.oneOf(BUSES).isRequired,
    slot: PropTypes.string.isRequired,
    vlan_id: PropTypes.number,
    module_id: PropTypes.number.isRequired,
    link_speed: PropTypes.number.isRequired,
    macaddr: PropTypes.string.isRequired,
    network: PropTypes.oneOf(["wan", "lan", "guest", "none"]).isRequired,
    configurable: PropTypes.bool.isRequired,
    WANIsEmpty: PropTypes.bool.isRequired,
    onNetworkChange: PropTypes.func.isRequired,
};

export default function SelectedInterface({
    id,
    type,
    state,
    bus,
    slot,
    vlan_id,
    module_id,
    link_speed,
    macaddr,
    network,
    configurable,
    WANIsEmpty,
    onNetworkChange,
}) {
    const myRef = useRef(null);
    useEffect(() => {
        myRef.current.scrollIntoView({ block: "start", behavior: "smooth" });
    }, [id]);

    const networkChoices = { ...NETWORKS_CHOICES };
    /*
    Prevent adding more than 1 interface to WAN group.
    Don't remove option if interface it's already in WAN as it breaks UX.
    */
    if (!WANIsEmpty && network !== "wan") delete networkChoices.wan;

    let stateIconClass;
    let stateIconColor;

    if (state === "up") {
        stateIconClass = "fa-check-circle";
        stateIconColor = "text-success";
    } else if (state === "down") {
        stateIconClass = "fa-times-circle";
        stateIconColor = "text-danger";
    } else {
        stateIconClass = "fa-question-circle";
        stateIconColor = "text-warning";
    }

    const moduleName = module_id !== 0 ? `(module ${module_id})` : "";

    return (
        <>
            <h3>{babel.format(_("Interface %s %s"), slot, moduleName)}</h3>
            <Select
                choices={networkChoices}
                label={_("Network")}
                value={network}
                disabled={!configurable}
                onChange={onNetworkChange}
            />
            <table ref={myRef} className="table table-hover">
                <tbody>
                    <tr>
                        <th>{_("State")}</th>
                        <td>
                            <span key={`${id}-${state}`}>
                                <FontAwesomeIcon
                                    icon={`fa-regular ${stateIconClass}`}
                                    className={stateIconColor}
                                    title={
                                        state[0].toUpperCase() + state.slice(1)
                                    }
                                />
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <th>{_("Module ID")}</th>
                        <td>{module_id}</td>
                    </tr>
                    <tr>
                        <th>{_("Slot")}</th>
                        <td>{slot}</td>
                    </tr>
                    <tr>
                        <th>{_("Interface ID")}</th>
                        <td>{id}</td>
                    </tr>
                    {vlan_id && (
                        <tr>
                            <th>{_("VLAN ID")}</th>
                            <td>{vlan_id}</td>
                        </tr>
                    )}
                    <tr>
                        <th>{_("Type")}</th>
                        <td>{type}</td>
                    </tr>
                    <tr>
                        <th>{_("Bus")}</th>
                        <td>{bus}</td>
                    </tr>
                    <tr>
                        <th>{_("Link speed")}</th>
                        <td>
                            {link_speed > 0 ? `${link_speed} Mbit/s` : _("N/A")}
                        </td>
                    </tr>
                    <tr>
                        <th>{_("MAC address")}</th>
                        <td>{macaddr.toUpperCase() || _("N/A")}</td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}
