const lanSettingsFixture = {
    mode_managed: {
        dhcp: {
            clients: [
                {
                    active: true,
                    expires: 1739233767,
                    hostname: "MacBook",
                    ip: "192.168.2.101",
                    mac: "CA:21:77:1E:AE:72",
                    static: true,
                },
                {
                    active: false,
                    expires: 1739233392,
                    hostname: "iPhone",
                    ip: "192.168.2.102",
                    mac: "26:48:9E:51:41:29",
                    static: false,
                },
            ],
            enabled: true,
            lease_time: 12,
            limit: 150,
            start: "192.168.2.100",
        },
        netmask: "255.255.255.0",
        router_ip: "192.168.2.1",
    },
};

export default lanSettingsFixture;
