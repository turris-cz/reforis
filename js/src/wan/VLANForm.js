/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { NumberInput, Switch } from "foris";
import PropTypes from "prop-types";

const HELP_TEXTS = {
    vlanEnabled: _(
        "Useful in cases when a specific VLAN ID is required by your internet service provider."
    ),
    vlanId: _("VLAN ID must be a number in the range between 1 and 4094."),
};

VLANForm.propTypes = {
    formData: PropTypes.shape({
        vlan_settings: PropTypes.shape({
            enabled: PropTypes.bool.isRequired,
            vlan_id: PropTypes.number,
        }),
    }).isRequired,
    formErrors: PropTypes.shape({
        vlandId: PropTypes.string,
    }),
    setFormValue: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

VLANForm.defaultProps = {
    setFormValue: () => {},
    formData: {},
};

export default function VLANForm({
    formData,
    formErrors,
    setFormValue,
    disabled,
}) {
    const vlanSettings = formData.vlan_settings;
    const errors = (formErrors || {}).vlan_settings || {};

    return (
        <>
            <h2>{_("VLAN Settings")}</h2>
            <Switch
                label={_("Enable VLAN")}
                checked={vlanSettings.enabled}
                helpText={HELP_TEXTS.vlanEnabled}
                onChange={setFormValue((value) => ({
                    vlan_settings: { enabled: { $set: value } },
                }))}
                disabled={disabled}
            />
            {vlanSettings.enabled && (
                <NumberInput
                    label={_("Set the VLAN ID")}
                    helpText={HELP_TEXTS.vlanId}
                    value={vlanSettings.vlan_id}
                    error={errors.vlanId}
                    min={1}
                    max={4094}
                    required
                    onChange={setFormValue((value) => ({
                        vlan_settings: { vlan_id: { $set: value } },
                    }))}
                    disabled={disabled}
                />
            )}
        </>
    );
}

export function validateVLANFrom(formData) {
    const vlanId = parseInt(formData.vlan_id);

    if (formData.enabled && formData.vlan_id === "")
        return { vlanId: _("This field is required.") };

    if (!Number.isNaN(vlanId) && vlanId < 1)
        return { vlanId: _("Value must be greater than or equal to 1.") };

    if (!Number.isNaN(vlanId) && vlanId > 4094)
        return { vlanId: _("Value must be less than or equal to 4094.") };
}
