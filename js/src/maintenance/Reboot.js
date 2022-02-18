/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { formFieldsSize } from "foris";

import RebootButton from "common/RebootButton";

export default function Reboot() {
    return (
        <div className={formFieldsSize}>
            <h2>{_("Reboot")}</h2>
            <p>
                {_(
                    "If you need to reboot the device, click on the following button. The reboot process takes approximately 30 seconds, and then you will be required to log in again."
                )}
            </p>
            <div className="text-right">
                <RebootButton forisFormSize />
            </div>
        </div>
    );
}
