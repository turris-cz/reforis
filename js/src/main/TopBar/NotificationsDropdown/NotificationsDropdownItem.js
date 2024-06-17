/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { ForisURLs, toLocaleDateString } from "foris";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { NOT_DISMISSIBLE } from "notifications/constants";
import NotificationIcon from "notifications/NotificationIcon";
import NOTIFICATION_PROP_TYPES from "notifications/utils";

import "./NotificationsDropdownItem.css";

NotificationsDropdownItem.propTypes = {
    notification: NOTIFICATION_PROP_TYPES,
    divider: PropTypes.bool.isRequired,
    dismiss: PropTypes.func.isRequired,
};

export default function NotificationsDropdownItem({
    notification,
    divider,
    dismiss,
}) {
    const date = toLocaleDateString(notification.created_at);
    const isDisableable = !NOT_DISMISSIBLE.includes(notification.severity);

    return (
        <>
            <div
                className="dropdown-item d-flex align-items-center py-2"
                style={{ transform: "rotate(0)" }}
            >
                <NotificationIcon
                    severity={notification.severity}
                    className="fa-2x me-2"
                />
                <Link
                    to={{
                        pathname: ForisURLs.overview,
                        search: `?id=${notification.id}`,
                    }}
                    className="d-flex flex-column stretched-link text-decoration-none me-2"
                >
                    <small className="text-muted">{date}</small>
                    <p
                        className="mb-0 d-inline-block text-truncate"
                        style={{ maxWidth: "14rem" }}
                    >
                        {notification.msg}
                    </p>
                </Link>
                <button
                    type="button"
                    className={`position-relative w-50 z-1 btn-close ${
                        !isDisableable ? " invisible" : ""
                    }`}
                    onClick={dismiss}
                />
            </div>
            {divider ? <div className="dropdown-divider m-0" /> : null}
        </>
    );
}
