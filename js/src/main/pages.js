/*
 * Copyright (C) 2019-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { ForisURLs } from "foris";

import About from "about/About";
import DNS from "dns/DNS";
import GuestNetwork from "guestNetwork/GuestNetwork";
import Hostname from "hostname/Hostname";
import Interfaces from "interfaces/Interfaces";
import LAN from "lan/LAN";
import Maintenance from "maintenance/Maintenance";
import NotificationsSettings from "notificationsSettings/NotificationsSettings";
import Overview from "overview/Overview";
import Languages from "packageManagement/languages/Languages";
import Packages from "packageManagement/packages/Packages";
import Updates from "packageManagement/updates/Updates";
import UpdateSettings from "packageManagement/updateSettings/UpdateSettings";
import Password from "password/Password";
import RegionAndTime from "regionAndTime/RegionAndTime";
import WAN from "wan/WAN";
import WiFi from "wifi/WiFi";

import { addWeightsToPages, insert } from "./utils";

const overviewPage = {
    name: _("Overview"),
    path: "/overview",
    icon: "chart-line",
    component: Overview,
};

const networkSettings = {
    name: _("Network Settings"),
    submenuId: "network-settings",
    path: "/network-settings",
    icon: "network-wired",
    pages: (isCustomized) =>
        isCustomized
            ? [
                  { name: _("WAN"), path: "/wan", component: WAN },
                  { name: _("LAN"), path: "/lan", component: LAN },
                  { name: _("DNS"), path: "/dns", component: DNS },
              ]
            : [
                  { name: _("Wi-Fi"), path: "/wifi", component: WiFi },
                  { name: _("WAN"), path: "/wan", component: WAN },
                  { name: _("LAN"), path: "/lan", component: LAN },
                  { name: _("DNS"), path: "/dns", component: DNS },
                  {
                      name: _("Interfaces"),
                      path: "/interfaces",
                      component: Interfaces,
                  },
                  {
                      name: _("Guest Network"),
                      path: "/guest-network",
                      component: GuestNetwork,
                  },
              ],
};

const administration = {
    name: _("Administration"),
    submenuId: "administration",
    path: "/administration",
    icon: "user-cog",
    pages: [
        { name: _("Password"), path: "/password", component: Password },
        {
            name: _("Region & Time"),
            path: "/region-and-time",
            component: RegionAndTime,
        },
        {
            name: _("Notifications"),
            path: "/notifications-settings",
            component: NotificationsSettings,
        },
        {
            name: _("Maintenance"),
            path: "/maintenance",
            component: Maintenance,
        },
        { name: _("Hostname"), path: "/hostname", component: Hostname },
    ],
};

const aboutPage = {
    name: _("About"),
    path: "/about",
    icon: "info-circle",
    component: About,
};

const globalThreatStatistics = {
    name: _("Global Threat Statistics"),
    path: "https://view.sentinel.turris.cz",
    icon: "chart-line",
    isLinkOutside: true,
};

const packageManagement = {
    name: _("Package Management"),
    submenuId: "package-management",
    path: "/package-management",
    icon: "box",
    pages: [
        { name: _("Updates"), path: "/updates", component: Updates },
        {
            name: _("Update Settings"),
            path: "/update-settings",
            component: UpdateSettings,
        },
        { name: _("Packages"), path: "/packages", component: Packages },
        { name: _("Languages"), path: "/languages", component: Languages },
    ],
};

const advancedAdministration = {
    name: _("Advanced Administration"),
    path: ForisURLs.luci,
    icon: "cog",
    isLinkOutside: true,
};

const getBasePages = (isCustomized) => [
    overviewPage,
    { ...networkSettings, pages: networkSettings.pages(isCustomized) },
    administration,
    isCustomized ? globalThreatStatistics : packageManagement,
    advancedAdministration,
    aboutPage,
];

export default function getPages(isCustomized) {
    const PAGES = getBasePages(isCustomized);

    const insertPluginsAfterTab = isCustomized ? 3 : 4;

    const itemsWithWeight = addWeightsToPages(
        insert(PAGES, insertPluginsAfterTab, ForisPlugins)
    );

    return itemsWithWeight;
}
