/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
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
                    `Your device can send you e-mail notifications about required reboots, important events, installed updates and new features according to your settings. When done with configuration, you can test it by pressing Send test notification.`
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
    formData = formData.emails;
    formData.common.to = formData.common.to.join(", ");
    return formData;
}

function prepDataToSubmit(formData) {
    if (!formData.enabled) return { enabled: false };
    formData.common.to = formData.common.to.replace(/\s+/g, "").split(",");

    if (formData.smtp_type === "turris") delete formData.smtp_custom;
    else if (formData.smtp_type === "custom") delete formData.smtp_turris;
    return formData;
}
