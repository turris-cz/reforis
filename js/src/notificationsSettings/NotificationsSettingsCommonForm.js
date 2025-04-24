import React from "react";

import PropTypes from "prop-types";

import CommonForm from "notificationsSettings/CommonForm";

NotificationsSettingsCommonForm.propTypes = {
    formData: PropTypes.object.isRequired,
    formErrors: PropTypes.object,
    setFormValue: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

NotificationsSettingsCommonForm.defaultProps = {
    setFormValue: () => {},
    formData: {},
    formErrors: {},
};

function NotificationsSettingsCommonForm({
    formData,
    formErrors,
    setFormValue,
    disabled,
}) {
    const { emails: emailsFormData } = formData;
    const { ntfy: ntfyFormData } = formData;

    if (!emailsFormData.enabled && !ntfyFormData.enabled) {
        return null;
    }

    return (
        <CommonForm
            formData={emailsFormData.common}
            formErrors={formErrors.common}
            setFormValue={setFormValue}
            disabled={disabled}
        />
    );
}

export default NotificationsSettingsCommonForm;
