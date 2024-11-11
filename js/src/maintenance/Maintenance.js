/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import { isPluginInstalled } from "foris";

import FactoryReset from "./FactoryReset";
import Reboot from "./Reboot";
import Syslog from "./Syslog/Syslog";

export default function Maintenance() {
    return (
        <>
            <h1>{_("Maintenance")}</h1>
            <p>
                {_(
                    "The Maintenance tab allows you to reboot the router or bring back all the default settings by performing a factory reset."
                )}
            </p>

            <Reboot />
            <FactoryReset />
            {isPluginInstalled("Storage") && <Syslog />}
        </>
    );
}
