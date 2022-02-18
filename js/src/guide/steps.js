/*
 * Copyright (C) 2019-2022 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import DNS from "dns/DNS";
import Interfaces from "interfaces/Interfaces";
import LAN from "lan/LAN";
import Updates from "packageManagement/updateSettings/UpdateSettings";
import Password from "password/Password";
import RegionAndTime from "regionAndTime/RegionAndTime";
import WAN from "wan/WAN";

import GuideFinished from "./GuidePages/GuideFinish";
import WorkflowSelect from "./GuidePages/WorkflowSelect";

const STEPS = {
    password: {
        name: _("Password"),
        component: Password,
    },
    profile: {
        name: _("Workflow"),
        component: WorkflowSelect,
    },
    networks: {
        name: _("Interfaces"),
        component: Interfaces,
    },
    time: {
        name: _("Time"),
        component: RegionAndTime,
    },
    dns: {
        name: _("DNS"),
        component: DNS,
    },
    updater: {
        name: _("Updates"),
        component: Updates,
    },
    wan: {
        name: _("WAN"),
        component: WAN,
    },
    lan: {
        name: _("LAN"),
        component: LAN,
    },
    finished: {
        name: _("Finish"),
        component: GuideFinished,
    },
};

export default STEPS;
