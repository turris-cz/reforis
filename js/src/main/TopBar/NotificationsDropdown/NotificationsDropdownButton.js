/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { ForisURLs, SpinnerElement } from "foris";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

import smallScreenWidth from "utils/constants";

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
    const history = useHistory();

    function redirectToNotificationCenter(e) {
        // We don't want to show dropdown on the small devices.
        // So just make redirect to notification center
        if (window.outerWidth > smallScreenWidth) return;
        e.preventDefault();
        e.stopPropagation();
        history.push(ForisURLs.notifications);
    }

    let componentContent;
    if (isLoading) {
        componentContent = <SpinnerElement small />;
    } else {
        componentContent = (
            <span className="fa-stack">
                <i className="fas fa-bell fa-stack-1x" />
                {notificationsCount !== 0 ? (
                    <NotificationCounter
                        notificationsCount={notificationsCount}
                        newNotification={newNotification}
                    />
                ) : null}
            </span>
        );
    }

    return (
        <button
            id="notifications-btn"
            className="nav-item btn btn-link"
            type="button"
            onClick={redirectToNotificationCenter}
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
        <div
            id="notifications-counter"
            className={newNotification ? "jump" : ""}
        >
            <div className="number">
                {notificationsCount < 99 ? notificationsCount : "..."}
            </div>
        </div>
    );
}
