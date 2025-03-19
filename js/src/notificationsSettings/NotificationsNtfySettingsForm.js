/*
 * Copyright (C) 2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { Switch, Select, TextInput } from "foris";
import PropTypes from "prop-types";

const PRIORITY_CHOICES = {
    max: _("Max"),
    urgent: _("Urgent"),
    high: _("High"),
    default: _("Default"),
    low: _("Low"),
    min: _("Min"),
};

NotificationsNtfySettingsForm.propTypes = {
    formData: PropTypes.shape({
        ntfy: PropTypes.shape({
            enabled: PropTypes.bool,
            url: PropTypes.string,
            priority: PropTypes.string,
        }),
    }).isRequired,
    formErrors: PropTypes.shape({
        ntfy: PropTypes.shape({
            url: PropTypes.string,
        }),
    }),
    setFormValue: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

NotificationsNtfySettingsForm.defaultProps = {
    setFormValue: () => {},
    formData: {},
    formErrors: {},
};

export default function NotificationsNtfySettingsForm({
    formData,
    formErrors,
    setFormValue,
    disabled,
}) {
    const { ntfy: ntfyFormData } = formData;
    return (
        <>
            <h2>{_("ntfy Notification Settings")}</h2>
            <Switch
                label={_("Enable ntfy notifications")}
                checked={ntfyFormData.enabled}
                onChange={setFormValue((value) => ({
                    ntfy: {
                        enabled: { $set: value },
                    },
                }))}
                disabled={disabled}
            />
            {ntfyFormData.enabled && (
                <>
                    <TextInput
                        label={_("URL")}
                        value={ntfyFormData.url || ""}
                        error={formErrors.ntfy?.url}
                        onChange={setFormValue((value) => ({
                            ntfy: {
                                url: { $set: value },
                            },
                        }))}
                        helpText={_("URL to send ntfy notifications to.")}
                        disabled={disabled}
                    />
                    <Select
                        choices={PRIORITY_CHOICES}
                        label={_("Priority")}
                        value={ntfyFormData.priority}
                        disabled={disabled}
                        onChange={setFormValue((value) => ({
                            ntfy: {
                                priority: {
                                    $set: value,
                                },
                            },
                        }))}
                        helpText={_("Priority of the ntfy notification.")}
                    />
                </>
            )}
        </>
    );
}
