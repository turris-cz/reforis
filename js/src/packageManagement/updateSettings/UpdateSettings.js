/*
 * Copyright (C) 2019-2023 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { ForisForm } from "foris";
import PropTypes from "prop-types";

import API_URLs from "common/API";

import UpdatesForm, { validateUpdates } from "./forms/UpdatesForm";
import LicenseModal from "./LicenseModal";

UpdateSettings.propTypes = {
    postCallback: PropTypes.func,
};

UpdateSettings.defaultProps = {
    postCallback: () => undefined,
};

export default function UpdateSettings({ postCallback }) {
    return (
        <>
            <h1>{_("Update Settings")}</h1>
            <p
                dangerouslySetInnerHTML={{
                    __html: _(
                        "The automatic updates system is one of the most important features of the Turris router. Thanks to this function, your router's software stays up to date and offers better protection against attacks from the Internet.<br>It is <b>highly recommended</b> to have this feature <b>turned on</b>. If you decide to disable it, be warned that this might weaken the security of your router and network in case flaws in the software are found."
                    ),
                }}
            />
            <p
                dangerouslySetInnerHTML={{
                    __html: _(
                        `By turning the automatic updates on, you agree to this feature's license agreement. More information is available <a href="" data-bs-toggle="modal" data-bs-target="#licenseModal">here</a>.`
                    ),
                }}
            />
            <LicenseModal />
            <ForisForm
                forisConfig={{
                    endpoint: API_URLs.updates,
                }}
                prepData={prepData}
                prepDataToSubmit={prepDataToSubmit}
                postCallback={postCallback}
                validator={validateUpdates}
            >
                <UpdatesForm />
            </ForisForm>
        </>
    );
}

function prepData(formData) {
    if (!formData.approval_settings.delay) formData.approval_settings.delay = 1;
    if (formData.enabled === null) formData.enabled = true;
    return formData;
}

function prepDataToSubmit(formData) {
    if (!formData.enabled) {
        delete formData.approval_settings;
        delete formData.languages;
        delete formData.package_lists;
    } else if (formData.approval_settings.status !== "delayed")
        delete formData.approval_settings.delay;
    return formData;
}
