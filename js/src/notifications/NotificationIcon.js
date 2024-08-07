/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import PropTypes from "prop-types";

import { SEVERITIES } from "./constants";

NotificationIcon.propTypes = {
    severity: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default function NotificationIcon({ severity, className }) {
    let iconName = null;
    switch (severity) {
        case SEVERITIES.NEWS:
            iconName = "newspaper";
            break;
        case SEVERITIES.RESTART:
            iconName = "power-off";
            break;
        case SEVERITIES.ERROR:
            iconName = "exclamation-circle";
            break;
        case SEVERITIES.UPDATE:
            iconName = "sync-alt";
            break;
        default:
    }

    return <i className={`fa-solid fa-${iconName} ${className}`} />;
}
