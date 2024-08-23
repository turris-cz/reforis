/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <FontAwesomeIcon
                    icon="fa-solid fa-power-off"
                    className="fa-lg text-danger"
                />
            </button>
            <ul
                className={`dropdown-menu dropdown-menu-${
                    window.outerWidth > smallScreenWidth ? "start" : "end"
                } shadow-sm`}
            >
                <div className="dropdown-header">
                    <Link
                        className="text-decoration-none"
                        to={{
                            pathname: ForisURLs.maintenance,
                        }}
                    >
                        <h5 className="mb-0 text-body">
                            {_("Reboot Required")}
                        </h5>
                    </Link>
                </div>
                <div className="dropdown-divider" />
                <div className="d-flex justify-content-around px-2">
                    <Link
                        to={{
                            pathname: ForisURLs.overview,
                            search: `?id=${rebootNotification.id}`,
                        }}
                        className="btn btn-primary"
                        type="button"
                    >
                        {_("Details")}
                    </Link>
                    <RebootButton />
                </div>
            </ul>
        </div>
    );
}
