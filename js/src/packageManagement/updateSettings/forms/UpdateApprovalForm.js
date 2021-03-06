/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { RadioSet, NumberInput, undefinedIfEmpty } from "foris";
import PropTypes from "prop-types";

const UPDATE_APPROVALS_CHOICES = [
    {
        value: "off",
        label: _("Automatic installation"),
        helpText: _("Updates will be installed without user's intervention."),
    },
    {
        value: "delayed",
        label: _("Delayed updates"),
        helpText: _(
            "Updates will be installed with an adjustable delay. You can also approve them manually."
        ),
    },
    {
        value: "on",
        label: _("Update approval needed"),
        helpText: _(
            "You have to approve the updates, otherwise they won't be installed."
        ),
    },
];

UpdateApprovalForm.propTypes = {
    setFormValue: PropTypes.func.isRequired,
    formData: PropTypes.shape({
        status: PropTypes.string,
        delay: PropTypes.number,
    }),
    formErrors: PropTypes.shape({
        delay: PropTypes.string,
    }),
    disabled: PropTypes.bool,
};

UpdateApprovalForm.defaultProps = {
    formErrors: {},
};

export default function UpdateApprovalForm({
    formData,
    formErrors,
    setFormValue,
    disabled,
}) {
    return (
        <>
            <h3>{_("Update Approvals")}</h3>
            <p>
                {_(
                    `Update approvals can be useful when you want to make sure that updates won't harm your specific
            configuration. You can e.g. install updates when you're prepared for a possible rollback to a previous
            snapshot and deny the questionable update temporarily. It isn't possible to decline the update forever an
            it will be offered to you again together with the next package installation.`
                )}
            </p>
            <RadioSet
                value={formData.status}
                name="approvals"
                choices={UPDATE_APPROVALS_CHOICES}
                onChange={setFormValue((value) => ({
                    approval_settings: { status: { $set: value } },
                }))}
                disabled={disabled}
            />
            {formData.status === "delayed" ? (
                <NumberInput
                    label={_("Delayed updates (hours)")}
                    value={formData.delay}
                    error={formErrors.delay}
                    min="1"
                    max="168"
                    onChange={setFormValue((value) => ({
                        approval_settings: { delay: { $set: value } },
                    }))}
                    disabled={disabled}
                />
            ) : null}
        </>
    );
}

export function validateUpdateApproval(formData) {
    const errors = {};
    if (formData.delay < 1 || formData.delay > 168) {
        errors.delay = _(
            "Updates must be delayed by least 1 hour and at most by 168 hours"
        );
    }
    return undefinedIfEmpty(errors);
}
