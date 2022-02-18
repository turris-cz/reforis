/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { CheckBox, ForisURLs } from "foris";
import PropTypes from "prop-types";

SyslogForm.defaultProps = {
    formErrors: {},
};

SyslogForm.propTypes = {
    formErrors: PropTypes.shape({
        noDiskMounted: PropTypes.string,
    }),
    formData: PropTypes.shape({
        persistent_logs: PropTypes.bool,
    }),
    setFormValue: PropTypes.func,
};

export default function SyslogForm({ formData, setFormValue, formErrors }) {
    return (
        <>
            <h2>{_("System Logs Retention")}</h2>
            <p>
                {_(
                    "During device reboot, system logs are lost by default. This option allows saving system logs using the Storage plugin. Logs are saved into '/srv/log/messages'."
                )}
            </p>
            <p
                dangerouslySetInnerHTML={{
                    __html: _(
                        `To enable this option, you have to configure storage in the <a href="${ForisURLs.storage}" title="Go to Storage plugin">Storage plugin</a> first.`
                    ),
                }}
            />
            <CheckBox
                label={_("Enable System Logs Retention")}
                disabled={!!formErrors.noDiskMounted}
                checked={formData.persistent_logs}
                onChange={setFormValue((value) => ({
                    persistent_logs: { $set: value },
                }))}
            />
        </>
    );
}
