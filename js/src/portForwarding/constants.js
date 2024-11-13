/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

export const EMPTY_RULE = {
    name: "",
    src_dport: "",
    dest_ip: "",
    dest_port: "",
    enabled: false,
};

export const HELP_TEXTS = {
    name: _("Enter the name of the port forwarding rule."),
    src_dport: _(
        "Enter the external port number to which the rule applies. It can be a single port or a range of ports."
    ),
    dest_ip: _(
        "Enter a valid IP address of the device to which the port will be forwarded. The best practice is to assign a static lease to the device in advance."
    ),
    dest_port: _(
        "Enter the internal port number to which the rule applies. It can be a single port or a range of ports."
    ),
    enabled: _("Enable or disable the port forwarding rule."),
};
