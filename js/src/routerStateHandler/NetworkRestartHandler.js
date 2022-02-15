/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { Spinner } from "foris";
import PropTypes from "prop-types";

import { STATES, useNetworkRestart } from "./hooks";

NetworkRestartHandler.propTypes = {
    ws: PropTypes.object.isRequired,
    controllerID: PropTypes.string,
};

export default function NetworkRestartHandler({ ws, controllerID }) {
    const [rebootState, remains] = useNetworkRestart(ws, controllerID);

    if (rebootState === STATES.NOT_TRIGGERED) return null;

    let message;
    switch (rebootState) {
        case STATES.TRIGGERED:
            message = babel.format(
                _("Network restart after %d sec."),
                remains || 0
            );
            break;
        case STATES.IN_PROGRESS:
            message = _("Network restarting");
            break;
        case STATES.DONE:
            message = _("Reconnecting");
            break;
        default:
    }

    return (
        <Spinner fullScreen>
            <h3>{message}</h3>
        </Spinner>
    );
}
