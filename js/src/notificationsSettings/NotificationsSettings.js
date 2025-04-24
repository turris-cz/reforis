/*
 * Copyright (C) 2019-2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ForisForm } from "foris";
import PropTypes from "prop-types";

import API_URLs from "common/API";

import NotificationsCommonSettingsForm from "./NotificationsSettingsCommonForm";
import NotificationsEmailSettingsForm from "./NotificationsSettingsEmailForm";
import NotificationsPushSettingsForm from "./NotificationsSettingsPushForm";
import TestNotification from "./TestNotification";
import validator from "./validator";

NotificationsSettings.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function NotificationsSettings({ ws }) {
    return (
        <>
            <h1>{_("Notifications")}</h1>
            <p>
                {_(
                    "Your device can send you e-mail notifications about required reboots, important events, installed updates, and new features according to your settings. Once you are done with the configuration, you can test it by pressing Send test notification. Additionally, you can use "
                )}
                <a
                    href="https://ntfy.sh/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {_("ntfy")}
                    <sup>
                        <FontAwesomeIcon
                            icon={["fas", "external-link-alt"]}
                            className="fa-sm ms-1"
                        />
                    </sup>
                </a>
                {_(
                    " to receive real-time push notifications directly to your mobile device or desktop. ntfy allows you to subscribe to topics and get instant alerts without the need for email."
                )}
            </p>
            <ForisForm
                ws={ws}
                forisConfig={{
                    endpoint: API_URLs.notificationsSettings,
                    wsModule: "router_notifications",
                    wsAction: "update_email_settings",
                }}
                prepData={prepData}
                prepDataToSubmit={prepDataToSubmit}
                validator={validator}
            >
                <NotificationsEmailSettingsForm />
                <NotificationsPushSettingsForm />
                <NotificationsCommonSettingsForm />
                <TestNotification />
            </ForisForm>
            <div id="test-notification" />
        </>
    );
}

function prepData(formData) {
    formData.emails.common.to = formData.emails.common.to.join(", ");
    return formData;
}

function prepDataToSubmit(formData) {
    // Emails
    if (formData.emails.enabled) {
        formData.emails.common.to = formData.emails.common.to
            .replace(/\s+/g, "")
            .split(",");

        if (formData.emails.smtp_type === "turris")
            delete formData.emails.smtp_custom;
        else if (formData.emails.smtp_type === "custom")
            delete formData.emails.smtp_turris;
    } else {
        formData.emails = {
            enabled: false,
        };
    }

    // Ntfy
    if (formData.ntfy.enabled) {
        formData.ntfy.url = formData.ntfy.url.trim();
    } else {
        formData.ntfy = {
            enabled: false,
        };
    }

    // Reboots
    delete formData.reboots;

    return formData;
}
