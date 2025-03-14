/*
 * Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

const packageListsFixture = {
    enabled: false,
    package_lists: [
        {
            description:
                "Software for participation in threat detection program which provides distributed adaptive firewall and statistics.",
            enabled: true,
            labels: [],
            name: "sentinel",
            options: [
                {
                    description:
                        "Add firewall rules to block attackers detected by Turris collection network.",
                    enabled: true,
                    labels: [],
                    name: "dynfw",
                    title: "Dynamic Firewall",
                },
            ],
            title: "Advanced security & analytics - Turris Sentinel",
            url: "https://docs.turris.cz/basics/sentinel/threat-detection/",
        },
        {
            description: "Tools to monitor local network and users on it.",
            enabled: true,
            labels: [],
            name: "net_monitoring",
            options: [
                {
                    description:
                        "Actively measures speed of Internet connection using LibreSpeed service.",
                    enabled: true,
                    labels: [],
                    name: "librespeed",
                    title: "Internet connection speed measurement",
                },
            ],
            title: "Network monitoring and parental control",
        },
        {
            description: "Easy setup of the OpenVPN server from reForis.",
            enabled: true,
            labels: [],
            name: "openvpn",
            options: [],
            title: "OpenVPN",
            url: "https://docs.turris.cz/basics/apps/openvpn/openvpn/",
        },
    ],
};

const automaticUpdatesCardFixture = {
    enabled: true,
};

const automaticUpdatesCardFixture2 = {
    enabled: false,
};

const threatDetectionCardFixture = {
    eula: 1,
};

const threatDetectionCardFixture2 = {
    eula: 0,
};

const librespeedCardFixture = {
    performed_tests: [
        {
            ping: -1,
            speed_download: 930,
            speed_upload: 930,
            test_uuid: "c7a6f82d-5128-47f3-a3f9-d7e9d9af64bd",
            time: 1598615466,
        },
    ],
    status: "ready",
};

const librespeedCardFixture2 = {};

const openVPNClientsCardFixture = [
    {
        enabled: true,
        id: "turris",
        running: true,
    },
];

const openVPNClientsCardFixture2 = [];

export {
    packageListsFixture,
    automaticUpdatesCardFixture,
    automaticUpdatesCardFixture2,
    threatDetectionCardFixture,
    threatDetectionCardFixture2,
    librespeedCardFixture,
    librespeedCardFixture2,
    openVPNClientsCardFixture,
    openVPNClientsCardFixture2,
};
