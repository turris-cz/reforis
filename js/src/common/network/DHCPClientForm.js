/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { TextInput, validateHostname } from "foris";
import PropTypes from "prop-types";

const HELP_TEXTS = {
    hostname: _("Hostname which will be provided to DHCP server."),
};

DHCPClientForm.propTypes = {
    formData: PropTypes.shape({
        hostname: PropTypes.string,
    }).isRequired,
    formErrors: PropTypes.shape({
        hostname: PropTypes.string,
    }),
    setFormValue: PropTypes.func.isRequired,
    updateRule: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default function DHCPClientForm({
    formData,
    formErrors,
    setFormValue,
    updateRule,
    disabled,
}) {
    return (
        <TextInput
            label={_("DHCP hostname")}
            value={formData.hostname || ""}
            error={(formErrors || {}).hostname || null}
            helpText={HELP_TEXTS.hostname}
            onChange={setFormValue((value) =>
                updateRule({ hostname: { $set: value } })
            )}
            disabled={disabled}
        />
    );
}

export function validateDHCPForm(formData) {
    const error = { hostname: validateHostname(formData.hostname) };
    return error.hostname ? error : null;
}
