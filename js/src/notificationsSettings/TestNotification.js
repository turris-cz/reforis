/*
/*
 * Copyright (C) 2019-2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect, useState } from "react";

import {
    ALERT_TYPES,
    API_STATE,
    Button,
    Portal,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useAlert,
    useAPIPost,
    formFieldsSize,
} from "foris";
import PropTypes from "prop-types";

import API_URLs from "common/API";

import { SEVERITY_OPTIONS } from "./CommonForm";

export const UNSAVED_CHANGES_MODAL_MESSAGE = _(
    "You have unsaved changes in your notification settings. Do you want to discard them and test notifications using the previous settings?"
);

TestNotification.propTypes = {
    formData: PropTypes.shape({
        emails: PropTypes.shape({
            enabled: PropTypes.bool,
            common: PropTypes.shape({
                severity_filter: PropTypes.oneOf(
                    Object.keys(SEVERITY_OPTIONS).map((key) => parseInt(key))
                ).isRequired,
            }),
        }),
        ntfy: PropTypes.shape({
            enabled: PropTypes.bool,
        }),
    }).isRequired,
    initialData: PropTypes.shape({
        emails: PropTypes.shape({
            enabled: PropTypes.bool,
            common: PropTypes.shape({
                severity_filter: PropTypes.oneOf(
                    Object.keys(SEVERITY_OPTIONS).map((key) => parseInt(key))
                ).isRequired,
            }),
        }),
        ntfy: PropTypes.shape({
            enabled: PropTypes.bool,
        }),
    }).isRequired,
    formErrors: PropTypes.shape({ enabled: PropTypes.bool }),
};

TestNotification.defaultProps = {
    formData: {},
    initialData: {},
};

export default function TestNotification({
    formData,
    formErrors,
    initialData,
}) {
    const { emails: emailsFormData } = formData;
    const { emails: initialDataEmails } = initialData;
    const { ntfy: ntfyFormData } = formData;
    const { ntfy: initialDataNtfy } = initialData;

    const [postState, post] = useAPIPost(API_URLs.sendTestNotification);
    const [setAlert] = useAlert();
    const [modalShown, setModalShown] = useState(false);

    useEffect(() => {
        if (postState.state === API_STATE.SUCCESS) {
            setAlert(postState.data, ALERT_TYPES.SUCCESS);
        } else if (postState.state === API_STATE.ERROR) {
            setAlert(postState.data);
        }
    }, [setAlert, postState]);

    if (!emailsFormData.enabled && !ntfyFormData.enabled) {
        return null;
    }

    const validateAndPostTestNotification = () => {
        if (
            JSON.stringify(initialDataEmails) !==
                JSON.stringify(emailsFormData) ||
            JSON.stringify(initialDataNtfy) !== JSON.stringify(ntfyFormData)
        ) {
            setModalShown(true);
            return;
        }
        post();
    };

    const submitPostNotification = () => {
        setModalShown(false);
        post();
    };

    const postIsSending = postState.state === API_STATE.SENDING;

    return (
        <Portal containerId="test-notification">
            <div className={formFieldsSize}>
                <h2>{_("Send Test Notification")}</h2>
                <p>
                    {_(
                        "Here you can verify whether your SMTP provider or push notifications are configured correctly by sending a test notification."
                    )}
                </p>
                <div className="text-end">
                    <Button
                        forisFormSize
                        loading={postIsSending}
                        disabled={postIsSending || formErrors}
                        onClick={validateAndPostTestNotification}
                    >
                        {_("Send")}
                    </Button>
                </div>
            </div>
            <UnsavedChangesWarningModal
                shown={modalShown}
                setShown={setModalShown}
                callback={submitPostNotification}
            />
        </Portal>
    );
}

UnsavedChangesWarningModal.propTypes = {
    shown: PropTypes.bool.isRequired,
    setShown: PropTypes.func.isRequired,
    callback: PropTypes.func.isRequired,
};

function UnsavedChangesWarningModal({ shown, setShown, callback }) {
    return (
        <Modal shown={shown} setShown={setShown}>
            <ModalHeader setShown={setShown} title={_("Warning!")} />
            <ModalBody>
                <p>{UNSAVED_CHANGES_MODAL_MESSAGE}</p>
            </ModalBody>
            <ModalFooter>
                <Button
                    className="btn-secondary"
                    onClick={() => setShown(false)}
                >
                    {_("Cancel")}
                </Button>
                <Button onClick={callback}>{_("Confirm")}</Button>
            </ModalFooter>
        </Modal>
    );
}
