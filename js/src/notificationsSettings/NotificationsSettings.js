/*
 * Copyright (C) 2019-2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { ForisForm } from "foris";
import PropTypes from "prop-types";

import API_URLs from "common/API";

import NotificationsEmailSettingsForm from "./NotificationsEmailSettingsForm";
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
                    "Your device can send you e-mail notifications about required reboots, important events, installed updates and new features according to your settings. When done with configuration, you can test it by pressing Send test notification."
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
    if (!formData.emails.enabled) return { emails: { enabled: false } };
    formData.emails.common.to = formData.emails.common.to
        .replace(/\s+/g, "")
        .split(",");

    if (formData.emails.smtp_type === "turris")
        delete formData.emails.smtp_custom;
    else if (formData.emails.smtp_type === "custom")
        delete formData.emails.smtp_turris;
    return formData;
}
