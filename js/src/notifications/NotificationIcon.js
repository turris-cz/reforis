/*
 * Copyright (C) 2019-2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

import { SEVERITIES } from "./constants";

NotificationIcon.propTypes = {
    severity: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default function NotificationIcon({ severity, className }) {
    let iconName = null;
    let iconColor = null;
    switch (severity) {
        case SEVERITIES.NEWS:
            iconName = "newspaper";
            iconColor = "text-primary";
            break;
        case SEVERITIES.RESTART:
            iconName = "power-off";
            iconColor = "text-danger";
            break;
        case SEVERITIES.ERROR:
            iconName = "exclamation-circle";
            iconColor = "text-danger";
            break;
        case SEVERITIES.UPDATE:
            iconName = "sync-alt";
            iconColor = "text-primary";
            break;
        case SEVERITIES.TEST:
            iconName = "vial";
            iconColor = "text-info";
            break;
        default:
    }

    return (
        <FontAwesomeIcon
            icon={`fa-solid fa-${iconName}`}
            className={`text-opacity-75 ${iconColor} ${className}`}
        />
    );
}
