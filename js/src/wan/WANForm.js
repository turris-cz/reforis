/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { Select, TextInput, PasswordInput } from "foris";
import PropTypes from "prop-types";

import DHCPClientForm, {
    validateDHCPForm,
} from "common/network/DHCPClientForm";
import StaticIPForm, { validateStaticForm } from "common/network/StaticIPForm";

const WAN_TYPES = {
    dhcp: "dhcp",
    static: "static",
    pppoe: "pppoe",
};

const WAN_TYPE_CHOICES = {
    dhcp: _("DHCP (automatic configuration)"),
    static: _("Static IP address (manual configuration)"),
    pppoe: _("PPPoE (for DSL bridges, etc.)"),
};

const FIELDS_PROP_TYPES = {
    wan_static: PropTypes.object,
    wan_dhcp: PropTypes.object,
    wan_pppoe: PropTypes.object,
};

WANForm.propTypes = {
    formData: PropTypes.shape({
        wan_settings: PropTypes.shape({
            wan_type: PropTypes.string.isRequired,
            ...FIELDS_PROP_TYPES,
        }),
    }).isRequired,
    formErrors: PropTypes.shape(FIELDS_PROP_TYPES),
    setFormValue: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

WANForm.defaultProps = {
    setFormValue: () => {},
    formData: {},
};

export default function WANForm({
    formData,
    formErrors,
    setFormValue,
    disabled,
}) {
    /* eslint-disable react/prop-types */
    const wanSettings = formData.wan_settings;
    const errors = (formErrors || {}).wan_settings || {};
    const wanType = wanSettings.wan_type;

    let wanForm = null;
    if (wanType === WAN_TYPES.dhcp) {
        wanForm = (
            <DHCPClientForm
                formData={wanSettings.wan_dhcp}
                formErrors={errors.wan_dhcp}
                updateRule={(value) => ({ wan_settings: { wan_dhcp: value } })}
                setFormValue={setFormValue}
                disabled={disabled}
            />
        );
    } else if (wanType === WAN_TYPES.static) {
        wanForm = (
            <StaticIPForm
                formData={wanSettings.wan_static}
                formErrors={errors.wan_static || {}}
                updateRule={(value) => ({
                    wan_settings: { wan_static: value },
                })}
                setFormValue={setFormValue}
                disabled={disabled}
            />
        );
    } else if (wanType === WAN_TYPES.pppoe) {
        wanForm = (
            <PPPoEForm
                formData={wanSettings.wan_pppoe}
                formErrors={errors.wan_pppoe}
                setFormValue={setFormValue}
                disabled={disabled}
            />
        );
    }

    return (
        <>
            <h2>{_("IPv4 Settings")}</h2>
            <Select
                label={_("IPv4 protocol")}
                value={wanType}
                choices={WAN_TYPE_CHOICES}
                onChange={setFormValue((value) => ({
                    wan_settings: { wan_type: { $set: value } },
                }))}
                disabled={disabled}
            />
            {wanForm}
        </>
    );
}

PPPoEForm.propTypes = {
    username: PropTypes.string,
    password: PropTypes.string,
};

PPPoEForm.defaultProps = {
    formErrors: {},
};

function PPPoEForm({ formData, formErrors, setFormValue, disabled }) {
    return (
        <>
            <TextInput
                label={_("PAP/CHAP username")}
                value={formData.username || ""}
                error={(formErrors || {}).username || null}
                required
                onChange={setFormValue((value) => ({
                    wan_settings: { wan_pppoe: { username: { $set: value } } },
                }))}
                disabled={disabled}
            />
            <PasswordInput
                withEye
                label={_("PAP/CHAP password")}
                value={formData.password || ""}
                error={(formErrors || {}).password || null}
                required
                onChange={setFormValue((value) => ({
                    wan_settings: { wan_pppoe: { password: { $set: value } } },
                }))}
                disabled={disabled}
            />
        </>
    );
}

export function validateWANForm(formData) {
    const errors = {};
    switch (formData.wan_type) {
        case WAN_TYPES.dhcp:
            errors.wan_dhcp = validateDHCPForm(formData.wan_dhcp);
            break;
        case WAN_TYPES.static:
            errors.wan_static = validateStaticForm(formData.wan_static);
            break;
        case WAN_TYPES.pppoe:
            errors.wan_pppoe = validatePPPoEForm(formData.wan_pppoe);
            break;
        default:
    }
    return errors[`wan_${formData.wan_type}`] ? errors : null;
}

function validatePPPoEForm(wan_pppoe) {
    const errors = {};
    ["username", "password"].forEach((field) => {
        if (!wan_pppoe[field] || wan_pppoe[field] === "")
            errors[field] = _("This field is required.");
    });
    return JSON.stringify(errors) !== "{}" ? errors : null;
}
