/*
 * Copyright (C) 2019-2025 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { Select, CheckBox } from "foris";
import PropTypes from "prop-types";

import HELP_TEXTS from "./helpTexts";

export const SEVERITY_OPTIONS = {
    // '0': _?,
    1: _("Reboot is required"),
    2: _("Reboot or attention is required"),
    3: _("Reboot or attention is required or update was installed"),
};

CommonForm.propTypes = {
    formData: PropTypes.shape({
        to: PropTypes.string,
        severity_filter: PropTypes.oneOf(
            Object.keys(SEVERITY_OPTIONS).map((key) => parseInt(key))
        ).isRequired,
        send_news: PropTypes.bool.isRequired,
    }).isRequired,
    formErrors: PropTypes.shape({ to: PropTypes.string }),
    setFormValue: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

CommonForm.defaultProps = {
    setFormValue: () => {},
    formData: {},
    formErrors: {},
};

export default function CommonForm({ formData, setFormValue, disabled }) {
    return (
        <>
            <h2>{_("General Notification Settings")}</h2>
            <Select
                label={_("Importance")}
                value={formData.severity_filter}
                choices={SEVERITY_OPTIONS}
                onChange={setFormValue((value) => ({
                    emails: {
                        common: { severity_filter: { $set: parseInt(value) } },
                    },
                }))}
                helpText={HELP_TEXTS.common.severity_filter}
                disabled={disabled}
            />
            <CheckBox
                label={_("Send news")}
                checked={formData.send_news}
                helpText={HELP_TEXTS.common.send_news}
                onChange={setFormValue((value) => ({
                    emails: {
                        common: { send_news: { $set: value } },
                    },
                }))}
                disabled={disabled}
            />
        </>
    );
}
