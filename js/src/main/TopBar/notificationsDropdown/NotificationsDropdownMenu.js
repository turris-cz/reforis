/*
 * Copyright (C) 2019-2023 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ForisURLs } from "foris";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";

import NOTIFICATION_PROP_TYPES from "notifications/utils";

import NotificationsDropdownItem from "./NotificationsDropdownItem";

import "simplebar-react/dist/simplebar.min.css";
import "./NotificationsDropdownMenu.css";

NotificationsDropdownMenu.propTypes = {
    notifications: PropTypes.arrayOf(NOTIFICATION_PROP_TYPES),
    dismiss: PropTypes.func.isRequired,
    dismissAll: PropTypes.func.isRequired,
};

export default function NotificationsDropdownMenu({
    notifications,
    dismiss,
    dismissAll,
}) {
    function getNotifications() {
        if (notifications.length === 0) {
            return (
                <p className="mt-2 mb-0 text-center text-muted">
                    {_("No notifications")}
                </p>
            );
        }

        return notifications.map((notification, idx) => (
            <NotificationsDropdownItem
                key={notification.id}
                notification={notification}
                divider={idx + 1 !== notifications.length} // Don't show last divider
                dismiss={() => dismiss(notification.id)}
            />
        ));
    }

    const footer =
        notifications.length !== 0 ? (
            <NotificationsDropdownFooter dismissAll={dismissAll} />
        ) : null;

    return (
        <ul className="dropdown-menu dropdown-menu-end shadow-sm">
            <NotificationsDropdownHeader />
            <SimpleBar className="scrollable-menu" autoHide={false}>
                {getNotifications()}
            </SimpleBar>
            {footer}
        </ul>
    );
}

function NotificationsDropdownHeader() {
    return (
        <>
            <div id="notifications-header" className="dropdown-header">
                <Link
                    className="text-decoration-none"
                    to={{
                        pathname: ForisURLs.overview,
                        hash: "#notifications",
                    }}
                >
                    <h5 className="mb-0 text-body">{_("Notifications")}</h5>
                </Link>
                <Link
                    to={ForisURLs.notificationsSettings}
                    className="btn btn-link"
                >
                    <FontAwesomeIcon icon="fa-solid fa-cog" className="fa-fw" />
                </Link>
            </div>
            <div className="dropdown-divider dropdown-divider-top" />
        </>
    );
}

NotificationsDropdownFooter.propTypes = {
    dismissAll: PropTypes.func.isRequired,
};

function NotificationsDropdownFooter({ dismissAll }) {
    return (
        <>
            <div className="dropdown-divider dropdown-divider-bottom" />
            <div id="notifications-footer" className="dropdown-footer">
                <button
                    type="button"
                    className="btn btn-link text-decoration-none"
                    onClick={dismissAll}
                >
                    {_("Dismiss all")}
                </button>
            </div>
        </>
    );
}
