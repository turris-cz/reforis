/*
 * Copyright (C) 2019-2023 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useCallback, useEffect, useContext } from "react";

import {
    SUBMIT_BUTTON_STATES,
    useForm,
    useAPIGet,
    useAPIPost,
    API_STATE,
    useAlert,
    ALERT_TYPES,
    ErrorMessage,
    formFieldsSize,
    Spinner,
} from "foris";
import PropTypes from "prop-types";

import API_URLs from "common/API";
import { CustomizationContext } from "context/customizationContext";

import ForisPasswordForm from "./ForisPasswordForm";
import RootPasswordForm from "./RootPasswordForm";

Password.propTypes = {
    postCallback: PropTypes.func.isRequired,
};

Password.defaultProps = {
    postCallback: () => undefined,
};

export default function Password({ postCallback }) {
    const [getPasswordResponse, getPassword] = useAPIGet(API_URLs.password);
    const customization = useContext(CustomizationContext);
    useEffect(() => {
        getPassword();
    }, [getPassword]);

    const [formState, onFormChangeHandler, resetFormData] = useForm(validator);

    const resetPasswordForm = useCallback(() => {
        resetFormData({
            currentForisPassword: "",
            newForisPassword: "",
            newForisPasswordRepeat: "",
            sameForRoot: false,
            newRootPassword: "",
            newRootPasswordRepeat: "",
        });
    }, [resetFormData]);

    useEffect(() => {
        resetPasswordForm();
    }, [resetPasswordForm]);

    const [setAlert, dismissAlert] = useAlert();
    const [postState, post] = useAPIPost(API_URLs.password);

    const postForisPassword = (event) => {
        event.preventDefault();
        dismissAlert();
        const data = {
            foris_current_password: formState.data.currentForisPassword,
            foris_password: formState.data.newForisPassword,
        };
        if (customization) data.root_password = formState.data.newForisPassword;
        if (formState.data.sameForRoot)
            data.root_password = formState.data.newForisPassword;
        post({ data });
    };

    const postRootPassword = (event) => {
        event.preventDefault();
        dismissAlert();
        const data = {
            foris_current_password: formState.data.currentForisPassword,
            root_password: formState.data.newRootPassword,
        };
        post({ data });
    };

    useEffect(() => {
        if (postState.data) {
            const forisPassword = postState.data.foris_password
                ? postState.data.foris_password
                : false;
            const rootPassword = postState.data.root_password
                ? postState.data.root_password
                : false;
            if (
                postState.state === API_STATE.SUCCESS &&
                (forisPassword.result === false ||
                    rootPassword.result === false)
            ) {
                setAlert(
                    _(
                        `The password you have entered has not been saved. It has been compromised and appears ${
                            forisPassword.count || rootPassword.count
                        } times in ${
                            forisPassword.list || rootPassword.list
                        } list. Please choose a more secure password.`
                    ),
                    ALERT_TYPES.ERROR
                );
            } else if (postState.state === API_STATE.SUCCESS) {
                setAlert(
                    _("Your password was set successfully."),
                    ALERT_TYPES.SUCCESS
                );
                postCallback();
            } else if (postState.state === API_STATE.ERROR) {
                setAlert(postState.data);
            }
            resetPasswordForm();
        }
    }, [postState, resetPasswordForm, postCallback, setAlert]);

    if (!formState.data) {
        return null;
    }

    const isSending = postState === API_STATE.SENDING;
    const submitButtonState = isSending
        ? SUBMIT_BUTTON_STATES.SAVING
        : SUBMIT_BUTTON_STATES.READY;

    const isPending = getPasswordResponse.state === API_STATE.SENDING;

    const onError = getPasswordResponse.state === API_STATE.ERROR;

    const onSuccess = getPasswordResponse.state === API_STATE.SUCCESS;

    let passwordComponent;

    if (isPending) {
        passwordComponent = <Spinner />;
    } else if (onError) {
        passwordComponent = <ErrorMessage />;
    } else if (onSuccess) {
        passwordComponent = (
            <div className={formFieldsSize}>
                <h2>{_("Password Settings")}</h2>
                <ForisPasswordForm
                    formData={formState.data}
                    formErrors={formState.errors}
                    submitButtonState={submitButtonState}
                    disabled={isSending}
                    setFormValue={onFormChangeHandler}
                    postForisPassword={postForisPassword}
                    passwordSet={getPasswordResponse.data.password_set}
                    customization={customization}
                />
                {!formState.data.sameForRoot && (
                    <RootPasswordForm
                        formData={formState.data}
                        formErrors={formState.errors}
                        submitButtonState={submitButtonState}
                        disabled={isSending}
                        setFormValue={onFormChangeHandler}
                        postRootPassword={postRootPassword}
                        customization={customization}
                    />
                )}
            </div>
        );
    }
    return (
        <>
            <h1>{_("Password")}</h1>
            <p>
                {_(
                    "Here you can set a password for the administration interface. Ensure it is secure by making it long and unique."
                )}
            </p>
            {passwordComponent}
        </>
    );
}

function validator(formData) {
    const errors = {
        newForisPassword: validatePassword(formData.newForisPassword),
        newRootPassword: !formData.sameForRoot
            ? validatePassword(formData.newRootPassword)
            : null,
        newForisPasswordRepeat:
            formData.newForisPasswordRepeat !== formData.newForisPassword
                ? _("Passwords do not match.")
                : null,
        newRootPasswordRepeat:
            formData.newRootPasswordRepeat !== formData.newRootPassword
                ? _("Passwords do not match.")
                : null,
    };

    if (
        errors.newForisPassword ||
        errors.newRootPassword ||
        errors.newForisPasswordRepeat ||
        errors.newRootPasswordRepeat
    )
        return errors;
    return {};
}

function validatePassword(password) {
    if (password === "") return _("Choose a password.");

    if (password.length < 6)
        return _("Password should have at least six symbols.");

    if (password.length > 128)
        return _("Password cannot have more than 128 symbols.");

    return null;
}
