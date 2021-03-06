/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import {
    undefinedIfEmpty,
    validateIPv4Address,
    validateMAC,
    withoutUndefinedKeys,
    validateHostname,
} from "foris";

export default function validator(formState) {
    const errors = {
        hostname:
            formState.hostname.length < 1
                ? _("Hostname cannot be empty.")
                : validateHostname(formState.hostname),
        ip:
            formState.ip.length < 1
                ? _("IPv4 address cannot be empty.")
                : validateIPv4Address(formState.ip),
        mac:
            formState.mac.length < 1
                ? _("MAC address cannot be empty.")
                : validateMAC(formState.mac),
    };

    return undefinedIfEmpty(withoutUndefinedKeys(errors));
}
