/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { Alert, ForisURLs } from "foris";

export default function DisabledUpdaterAlert() {
    const message = _(
        `Please enable <a href="${ForisURLs.packageManagement.updateSettings}">automatic updates</a> to manage packages and languages.`
    );
    // <Alert /> is used instead of context because warning isn't result of any action on this page
    return (
        <Alert type="warning">
            <span dangerouslySetInnerHTML={{ __html: message }} />
        </Alert>
    );
}
