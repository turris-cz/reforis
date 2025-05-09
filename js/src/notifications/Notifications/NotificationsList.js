/*
 * Copyright (C) 2019-2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useRef, useEffect } from "react";

import { toLocaleDateString } from "foris";
import PropTypes from "prop-types";

import RebootButton from "common/RebootButton";

import TruncatedText from "./TruncatedText";
import { NOT_DISMISSIBLE } from "../constants";
import NotificationIcon from "../NotificationIcon";
import NOTIFICATION_PROP_TYPES from "../utils";

NotificationsList.propTypes = {
    notifications: PropTypes.arrayOf(NOTIFICATION_PROP_TYPES),
    dismiss: PropTypes.func.isRequired,
};

export default function NotificationsList({
    notifications,
    dismiss,
    currentNotification,
}) {
    return notifications.map((notification) => (
        <NotificationsCenterItem
            key={notification.id}
            notification={notification}
            isCurrent={notification.id === currentNotification}
            dismiss={() => dismiss(notification.id)}
        />
    ));
}

const BORDER_TYPES = {
    news: "border-primary",
    update: "border-primary",
    restart: "border-danger",
    error: "border-danger",
    test: "border-info",
};

const HIGHLIGHT_TYPES = {
    news: "highlight-primary",
    update: "highlight-primary",
    restart: "highlight-danger",
    error: "highlight-danger",
    test: "highlight-info",
};

NotificationsCenterItem.propTypes = {
    notification: NOTIFICATION_PROP_TYPES,
    isCurrent: PropTypes.bool.isRequired,
    dismiss: PropTypes.func.isRequired,
};

function NotificationsCenterItem({ notification, isCurrent, dismiss }) {
    const notificationRef = useRef(isCurrent);

    useEffect(() => {
        if (isCurrent && notificationRef.current) {
            notificationRef.current.scrollIntoView({
                block: "start",
                behavior: "smooth",
            });
        }
    }, [isCurrent]);
    const isDisableable = !NOT_DISMISSIBLE.includes(notification.severity);
    return (
        <div
            ref={notificationRef}
            className={`card ${BORDER_TYPES[notification.severity]}`}
        >
            <div
                className={
                    isCurrent && notificationRef.current
                        ? `card-header ${
                              HIGHLIGHT_TYPES[notification.severity]
                          }`
                        : "card-header"
                }
            >
                <NotificationIcon
                    severity={notification.severity}
                    className="fa-lg"
                />
                <p className="text-muted align-middle m-0">
                    {toLocaleDateString(notification.created_at)}
                </p>
                <button
                    type="button"
                    className={`btn-close ${!isDisableable ? "invisible" : ""}`.trim()}
                    onClick={dismiss}
                    aria-label={_("Close")}
                />
            </div>

            <div className="card-body">
                <TruncatedText text={notification.msg} charLimit={256} />
            </div>
            {notification.severity === "restart" ? <RebootButton /> : null}
        </div>
    );
}
