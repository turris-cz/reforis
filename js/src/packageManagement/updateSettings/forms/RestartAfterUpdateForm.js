/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { DataTimeInput, NumberInput, undefinedIfEmpty } from "foris";
import moment from "moment";
import PropTypes from "prop-types";

const TIME_FORMAT = "HH:mm";

const HELP_TEXTS = {
    delay: _(
        "Number of days that must pass between receiving the request for restart and the automatic restart itself."
    ),
    time: _("Time of day of automatic reboot in HH:MM format."),
};

RestartAfterUpdateForm.propTypes = {
    formData: PropTypes.shape({
        time: PropTypes.string,
        delay: PropTypes.number,
    }).isRequired,
    formErrors: PropTypes.shape({
        time: PropTypes.string,
        delay: PropTypes.string,
    }),
    setFormValue: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

RestartAfterUpdateForm.defaultProps = {
    formErrors: {},
};

export default function RestartAfterUpdateForm({
    formData,
    formErrors,
    setFormValue,
    disabled,
}) {
    const rebootTime = moment(formData.time, "HH:mm");
    return (
        <>
            <h2>{_("Automatic Restarts After Software Update")}</h2>
            <NumberInput
                label={_("Delay (days)")}
                min={0}
                max={10}
                value={formData.delay}
                error={formErrors.delay}
                helpText={HELP_TEXTS.delay}
                onChange={setFormValue((value) => ({
                    reboots: { delay: { $set: value } },
                }))}
                disabled={disabled}
            />
            <DataTimeInput
                label={_("Reboot time")}
                value={rebootTime.isValid() ? rebootTime : formData.time}
                error={formErrors.time}
                timeFormat={TIME_FORMAT}
                dateFormat={false}
                helpText={HELP_TEXTS.time}
                onChange={(value) => {
                    if (typeof value === "string") {
                        return setFormValue((formValue) => ({
                            reboots: { time: { $set: formValue } },
                        }))({ target: { value } });
                    }
                    return setFormValue((formValue) => ({
                        reboots: { time: { $set: formValue } },
                    }))({ target: { value: value.format("HH:mm") } });
                }}
                disabled={disabled}
            />
        </>
    );
}

export function validateRestartAfterUpdate(formData) {
    const errors = {};
    if (!moment(formData.time, "HH:mm", true).isValid()) {
        errors.time = _("Time should be in HH:MM format.");
    }
    if (formData.delay > 10) {
        errors.delay = _("Restart can be delayed by at most 10 days");
    }
    if (formData.delay < 0) {
        errors.delay = _("Delay must be a positive number");
    }
    return undefinedIfEmpty(errors);
}
