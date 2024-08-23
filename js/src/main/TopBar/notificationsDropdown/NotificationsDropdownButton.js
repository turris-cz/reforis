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

import "./NotificationsDropdownButton.css";

NotificationsDropdownButton.propTypes = {
    notificationsCount: PropTypes.number.isRequired,
    newNotification: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
};

export default function NotificationsDropdownButton({
    notificationsCount,
    newNotification,
    isLoading,
}) {
    let componentContent;
    if (isLoading) {
        componentContent = <SpinnerElement className="text-primary" small />;
    } else {
        componentContent = (
            <div className="position-relative">
                <FontAwesomeIcon icon="fa-solid fa-bell" className="fa-lg" />
                {notificationsCount !== 0 && (
                    <NotificationCounter
                        notificationsCount={notificationsCount}
                        newNotification={newNotification}
                    />
                )}
            </div>
        );
    }

    return (
        <button
            id="notifications-btn"
            className="nav-item btn btn-link text-body"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
        >
            {componentContent}
        </button>
    );
}

NotificationCounter.propTypes = {
    notificationsCount: PropTypes.number.isRequired,
    newNotification: PropTypes.bool.isRequired,
};

function NotificationCounter({ notificationsCount, newNotification }) {
    return (
        <span
            className={`position-absolute top-0 start-100 translate-middle badge rounded-pill text-bg-danger ms-0 ${newNotification ? "jump" : ""}`.trim()}
        >
            {notificationsCount < 99 ? notificationsCount : "..."}
            <span className="visually-hidden">unread messages</span>
        </span>
    );
}
