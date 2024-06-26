/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useState } from "react";

import {
    ForisURLs,
    PasswordInput,
    SubmitButton,
    SUBMIT_BUTTON_STATES,
} from "foris";
import PropTypes from "prop-types";

RootPasswordForm.propTypes = {
    formData: PropTypes.shape({
        newRootPassword: PropTypes.string,
        newRootPasswordRepeat: PropTypes.string,
    }).isRequired,
    submitButtonState: PropTypes.oneOf(
        Object.keys(SUBMIT_BUTTON_STATES).map(
            (key) => SUBMIT_BUTTON_STATES[key]
        )
    ).isRequired,
    formErrors: PropTypes.shape({
        newRootPassword: PropTypes.string,
        newRootPasswordRepeat: PropTypes.string,
    }),
    setFormValue: PropTypes.func.isRequired,
    postRootPassword: PropTypes.func.isRequired,
    customization: PropTypes.bool.isRequired,
    disabled: PropTypes.bool,
};

export default function RootPasswordForm({
    formData,
    formErrors,
    setFormValue,
    submitButtonState,
    postRootPassword,
    disabled,
    customization,
}) {
    const [errorFeedbackRoot, setErrorFeedbackRoot] = useState(false);
    if (customization) return null;
    return (
        <form onSubmit={postRootPassword}>
            <h3>{_("Advanced Administration Password")}</h3>
            <p
                dangerouslySetInnerHTML={{
                    __html: babel.format(
                        _(
                            `In order to access the advanced configuration options which are not available here, you must
set the root user's password. The advanced configuration options can be managed either 
through the <a href="%s" target="_blank" rel="noopener noreferrer">LuCI web interface</a> or via SSH.`
                        ),
                        ForisURLs.luci
                    ),
                }}
            />
            <PasswordInput
                newPass
                withEye
                label={_("New password")}
                value={formData.newRootPassword}
                error={errorFeedbackRoot ? formErrors.newRootPassword : ""}
                onChange={setFormValue((value) => ({
                    newRootPassword: { $set: value },
                }))}
                onFocus={() => setErrorFeedbackRoot(true)}
                disabled={disabled}
            />
            <PasswordInput
                newPass
                withEye
                label={_("Confirm new password")}
                value={formData.newRootPasswordRepeat}
                error={formErrors.newRootPasswordRepeat}
                onChange={setFormValue((value) => ({
                    newRootPasswordRepeat: { $set: value },
                }))}
                disabled={disabled}
            />
            <div className="text-end">
                <SubmitButton
                    state={submitButtonState}
                    disabled={
                        !!formErrors.newRootPassword ||
                        !!formErrors.newRootPasswordRepeat
                    }
                    onClick={() => setErrorFeedbackRoot(false)}
                />
            </div>
        </form>
    );
}
