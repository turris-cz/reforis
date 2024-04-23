/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { ForisURLs } from "foris";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import RebootButton from "common/RebootButton";
import smallScreenWidth from "utils/constants";

import "./RebootDropdown.css";

RebootDropdown.propTypes = {
    notifications: PropTypes.array.isRequired,
};

export default function RebootDropdown({ notifications }) {
    const rebootNotification = notifications.find(
        (notification) => notification.severity === "restart"
    );
    if (!rebootNotification) {
        return null;
    }

    return (
        <div className="dropdown">
            <button
                type="button"
                id="reboot-dropdown-toggle"
                className="nav-item btn btn-link text-body"
            >
                <i className="fas fa-power-off fa-lg" />
            </button>
            <div
                className={`dropdown-menu dropdown-menu-${
                    window.outerWidth > smallScreenWidth ? "start" : "end"
                } shadow-sm`}
            >
                <div className="dropdown-header">
                    <Link
                        to={{
                            pathname: ForisURLs.maintenance,
                        }}
                    >
                        <h5>{_("Reboot Required")}</h5>
                    </Link>
                </div>
                <div className="dropdown-divider" />
                <div className="dropdown-item">
                    <Link
                        to={{
                            pathname: ForisURLs.overview,
                            search: `?id=${rebootNotification.id}`,
                        }}
                    >
                        <button type="button" className="btn btn-primary me-3">
                            {_("Details")}
                        </button>
                    </Link>
                    <RebootButton />
                </div>
            </div>
        </div>
    );
}
