/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect, useState, useRef } from "react";

import { Spinner } from "foris";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import DismissAllButton from "./DismissAllButton";
import NotificationsList from "./NotificationsList";
import { NOT_DISMISSIBLE } from "../constants";
import useNotifications from "../hooks";

import "./Notifications.css";

Notifications.propTypes = {
    ws: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

function Notifications({ ws, history }) {
    const [notifications, dismiss, dismissAll, isLoading] =
        useNotifications(ws);
    const [currentNotification, setCurrentNotification] = useState();

    function getIDFromSearch(search) {
        const params = new URLSearchParams(search);
        return params.get("id");
    }

    useEffect(() => {
        // Set initial notification
        setCurrentNotification(getIDFromSearch(window.location.search));
        // Listen to changes
        return history.listen((location) => {
            setCurrentNotification(getIDFromSearch(location.search));
        });
    }, [history]);

    const notificationSectionRef = useRef(null);

    let componentContent;
    const dismissibleNotificationsCount = notifications.filter(
        (notification) => !NOT_DISMISSIBLE.includes(notification.severity)
    ).length;

    if (isLoading) {
        componentContent = <Spinner />;
    } else if (notifications.length === 0) {
        componentContent = (
            <p className="text-muted text-center">{_("No notifications")}</p>
        );
    } else {
        componentContent = (
            <NotificationsList
                currentNotification={currentNotification}
                notifications={notifications}
                dismiss={dismiss}
            />
        );
    }

    return (
        <>
            <h2
                ref={notificationSectionRef}
                className="d-flex justify-content-between align-items-center"
            >
                {_("Notifications")}
                {dismissibleNotificationsCount > 0 && (
                    <DismissAllButton dismissAll={dismissAll} />
                )}
            </h2>
            <div id="notifications-center">{componentContent}</div>
        </>
    );
}

export default withRouter(Notifications);
